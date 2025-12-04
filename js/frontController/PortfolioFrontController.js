class PortfolioFrontController {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8001'
        this.portfolios = []
        this.tiposSolicitante = []
        this.http = new HttpService(this.API_BASE_URL)
        this.notification = new NotificationService()
        this.dateService = new DateService()
        this.modal = new ModalPortfolio(this.API_BASE_URL, this.http)
        this.render = new PortfolioRender(this.dateService)
        this.filtroRender = new FiltroRender()
        this.filtroController = new FiltroController((filtros) => this.aplicarFiltros(filtros))
        this.inicializar()
    }
    async inicializar() {
        try {
            await Promise.all([
                this.carregarTiposSolicitante(),
                this.carregarPortfolios()
            ])
            BotoesFiltroRender.renderizarBotoes('botoesFiltroContainer')
            this.configurarFiltros()

            // Configurar botão de novo portfólio
            const btnNovo = document.getElementById('btnNovoPortfolio')
            if (btnNovo) {
                btnNovo.addEventListener('click', () => {
                    this.modal.abrir(() => this.carregarPortfolios())
                })
            }
        } catch (erro) {
            console.error('Erro na inicialização:', erro)
            this.notification.mostrarErro('Erro ao carregar dados: ' + erro.message)
        }
    }
    async carregarTiposSolicitante() {
        try {
            this.tiposSolicitante = await this.http.get('/tiposSolicitantes')
            this.filtroRender.renderizarSelectTipoSolicitante('filtroTipoSolicitante', this.tiposSolicitante)
        } catch (erro) {
            console.error('Erro ao carregar tipos de solicitante:', erro)
            this.notification.mostrarErro('Erro ao carregar tipos de solicitante')
        }
    }
    async carregarPortfolios() {
        try {
            this.portfolios = await this.http.get('/portfolios')
            this.filtroRender.renderizarSelectStatus('filtroStatus', this.portfolios.map(p => p.status))
            this.renderizarTabela()
        } catch (erro) {
            console.error('Erro ao carregar portfólios:', erro)
            this.notification.mostrarErro('Erro ao carregar portfólios')
        }
    }
    configurarFiltros() {
        this.filtroController.registrarFiltro('status', 'todos')
        this.filtroController.registrarFiltro('tipoSolicitante', 'todos')
        this.filtroController.configurarSelect('filtroStatus', 'status')
        this.filtroController.configurarSelect('filtroTipoSolicitante', 'tipoSolicitante')
        const btnAplicar = document.getElementById('btnAplicarFiltros')
        if (btnAplicar) btnAplicar.classList.add('d-none')

        BotoesFiltroRender.configurarEventos(
            () => this.limparFiltros(),
            async () => {
                await this.carregarPortfolios()
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
        let portfolios = [...this.portfolios]
        const filtroStatus = filtros ? filtros.status : this.filtroController.obterValorFiltro('status')
        const filtroTipo = filtros ? filtros.tipoSolicitante : this.filtroController.obterValorFiltro('tipoSolicitante')
        if (filtroStatus && filtroStatus !== 'todos') {
            portfolios = portfolios.filter(p => {
                const status = (p.status || '').trim()
                return status.toLowerCase() === filtroStatus.toLowerCase()
            })
        }
        if (filtroTipo && filtroTipo !== 'todos') {
            portfolios = portfolios.filter(p => p.tipo_solicitante === filtroTipo)
        }
        portfolios.sort((a, b) => a.id - b.id)
        this.render.renderizarTabela(
            portfolios,
            (id) => this.editarPortfolio(id),
            (id, status) => this.toggleStatus(id),
            (id) => this.deletarPermanente(id)
        )
    }
    async deletarPermanente(id) {
        if (!PermissaoAdmin.verificarPermissao(false)) {
            this.notification.mostrarErro('Apenas administradores podem excluir portfólios permanentemente!')
            return
        }
        if (!confirm('Tem certeza que deseja excluir este portfólio permanentemente? Esta ação não pode ser desfeita.')) return
        try {
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/portfolios/${id}/deletar`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!resposta.ok) throw new Error('Erro ao excluir portfólio')
            this.notification.mostrarSucesso('Portfólio excluído com sucesso!')
            await this.carregarPortfolios()
        } catch (erro) {
            this.notification.mostrarErro(erro.message)
        }
    }
    async editarPortfolio(id) {
        await this.modal.abrirEditar(id, () => this.carregarPortfolios())
    }
    async salvarPortfolio() {
        await this.modal.salvar(async () => {
            await this.carregarPortfolios()
        })
    }
    async toggleStatus(id) {
        const portfolio = this.portfolios.find(p => p.id === id)
        if (!portfolio) return
        const statusAtual = portfolio.status
        if (!confirm(`Deseja realmente ${statusAtual === 'Ativo' ? 'desativar' : 'ativar'} este portfólio?`)) {
            return
        }
        try {
            const novoStatus = statusAtual === 'Ativo' ? 'Inativo' : 'Ativo'
            await this.http.put(`/portfolios/${id}`, { status: novoStatus })
            this.notification.mostrarSucesso('Status atualizado com sucesso!')
            await this.carregarPortfolios()
        } catch (erro) {
            this.notification.mostrarErro('Erro ao atualizar status')
        }
    }
}
// Não auto-instanciar - será instanciado pelo Inicializador
window.PortfolioFrontController = PortfolioFrontController
