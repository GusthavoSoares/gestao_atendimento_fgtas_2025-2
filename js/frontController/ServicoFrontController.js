class ServicoFrontController {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8001'
        this.servicos = []
        this.portfolios = []
        this.http = new HttpService(this.API_BASE_URL)
        this.notification = new NotificationService()
        this.dateService = new DateService()
        this.modal = new ModalServico(this.API_BASE_URL, this.http)
        this.render = new ServicoRender(this.dateService)
        this.filtroRender = new FiltroRender()
        this.filtroController = new FiltroController((filtros) => this.aplicarFiltros(filtros))
        this.inicializar()
    }
    async inicializar() {
        try {
            await Promise.all([
                this.carregarPortfolios(),
                this.carregarServicos()
            ])
            BotoesFiltroRender.renderizarBotoes('botoesFiltroContainer')
            this.configurarFiltros()

            // Configurar botão de novo serviço
            const btnNovo = document.getElementById('btnNovoServico')
            if (btnNovo) {
                btnNovo.addEventListener('click', () => {
                    this.modal.abrir(() => this.carregarServicos())
                })
            }
        } catch (erro) {
            console.error('Erro na inicialização:', erro)
            this.notification.mostrarErro('Erro ao carregar dados: ' + erro.message)
        }
    }
    async carregarPortfolios() {
        try {
            this.portfolios = await this.http.get('/portfolios')
            const filtroPortfolio = document.getElementById('filtroPortfolio')
            if (filtroPortfolio) {
                filtroPortfolio.innerHTML = '<option value="todos">Todos</option>'
                this.portfolios.forEach(p => {
                    const opt = document.createElement('option')
                    opt.value = p.nome
                    opt.textContent = p.nome
                    filtroPortfolio.appendChild(opt)
                })
            }
        } catch (erro) {
            console.error('Erro ao carregar portfólios:', erro)
            this.notification.mostrarErro('Erro ao carregar portfólios')
        }
    }
    async carregarServicos() {
        try {
            this.servicos = await this.http.get('/servicos')
            this.filtroRender.renderizarSelectStatus('filtroStatus', this.servicos.map(s => s.status))
            this.renderizarTabela()
        } catch (erro) {
            console.error('Erro ao carregar serviços:', erro)
            this.notification.mostrarErro('Erro ao carregar serviços')
        }
    }
    configurarFiltros() {
        this.filtroController.registrarFiltro('status', 'todos')
        this.filtroController.registrarFiltro('portfolio', 'todos')
        this.filtroController.configurarSelect('filtroStatus', 'status')
        this.filtroController.configurarSelect('filtroPortfolio', 'portfolio')
        const btnAplicar = document.getElementById('btnAplicarFiltros')
        if (btnAplicar) btnAplicar.classList.add('d-none')

        BotoesFiltroRender.configurarEventos(
            () => this.limparFiltros(),
            async () => {
                await this.carregarServicos()
                this.notification.mostrarSucesso('Dados recarregados com sucesso!')
            }
        )
    }

    limparFiltros() {
        this.filtroController.limparFiltros()
        this.notification.mostrarSucesso('Filtros limpos com sucesso!')
    }

    aplicarFiltros(filtros) {
        this.renderizarTabela(filtros)
    }
    renderizarTabela(filtros = null) {
        let servicos = [...this.servicos]
        const filtroStatus = filtros ? filtros.status : this.filtroController.obterValorFiltro('status')
        const filtroPortfolio = filtros ? filtros.portfolio : this.filtroController.obterValorFiltro('portfolio')
        if (filtroStatus && filtroStatus !== 'todos') {
            servicos = servicos.filter(s => {
                const status = (s.status || '').trim()
                return status.toLowerCase() === filtroStatus.toLowerCase()
            })
        }
        if (filtroPortfolio && filtroPortfolio !== 'todos') {
            servicos = servicos.filter(s => s.portfolio === filtroPortfolio)
        }
        servicos.sort((a, b) => a.id - b.id)
        this.render.renderizarTabela(
            servicos,
            (id) => this.editarServico(id),
            (id, status) => this.toggleStatus(id, status),
            (id) => this.deletarPermanente(id)
        )
    }
    async deletarPermanente(id) {
        if (!PermissaoAdmin.verificarPermissao(false)) {
            this.notification.mostrarErro('Apenas administradores podem excluir serviços permanentemente!')
            return
        }
        if (!confirm('Tem certeza que deseja excluir este serviço permanentemente? Esta ação não pode ser desfeita.')) return
        try {
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/servicos/${id}/deletar`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!resposta.ok) throw new Error('Erro ao excluir serviço')
            this.notification.mostrarSucesso('Serviço excluído com sucesso!')
            await this.carregarServicos()
        } catch (erro) {
            this.notification.mostrarErro(erro.message)
        }
    }
    async editarServico(id) {
        await this.modal.abrirEditar(id, () => this.carregarServicos())
    }
    async salvarServico() {
        await this.modal.salvar(async () => {
            await this.carregarServicos()
        })
    }
    async toggleStatus(id, statusAtual) {
        if (!confirm(`Deseja realmente ${statusAtual === 'Ativo' ? 'desativar' : 'ativar'} este serviço?`)) {
            return
        }
        try {
            const novoStatus = statusAtual === 'Ativo' ? 'Inativo' : 'Ativo'
            await this.http.put(`/servicos/${id}`, { status: novoStatus })
            this.notification.mostrarSucesso('Status atualizado com sucesso!')
            await this.carregarServicos()
        } catch (erro) {
            this.notification.mostrarErro('Erro ao atualizar status')
        }
    }
}
// Não auto-instanciar - será instanciado pelo Inicializador
window.ServicoFrontController = ServicoFrontController
