class ServicoFrontController {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8001'
        this.servicos = []
        this.portfolios = []
        this.editandoId = null
        this.http = new HttpService(this.API_BASE_URL)
        this.notification = new NotificationService()
        this.dateService = new DateService()
        this.modal = new window.ModalServico(this.API_BASE_URL, this.http)
        this.render = new ServicoRender(this.dateService)
        this.filtroRender = new FiltroRender()
        this.filtroController = new FiltroController((filtros) => this.aplicarFiltros(filtros))
        this.inicializar()
    }
    async inicializar() {
        try {
            await this.carregarPortfolios()
            await this.carregarServicos()
            BotoesFiltroRender.renderizarBotoes('botoesFiltroContainer')
            this.configurarFiltros()
            document.getElementById('btnSalvarServico').addEventListener('click', () => this.salvarServico())
        } catch (erro) {
            console.error('Erro na inicialização:', erro)
            this.notification.mostrarErro('Erro ao carregar dados: ' + erro.message)
        }
    }
    async carregarPortfolios() {
        try {
            this.portfolios = await this.http.get('/portfolios')
        } catch (erro) {
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
        if (btnAplicar) {
            btnAplicar.classList.add('d-none')
        }
        
        BotoesFiltroRender.configurarEventos(
            () => this.filtroController.limparFiltros(),
            async () => {
                await this.carregarServicos()
                this.notification.mostrarSucesso('Dados recarregados com sucesso!')
            }
        )
        
        const filtroPor = document.getElementById('filtroPortfolio')
        if (filtroPor) {
            this.portfolios.forEach(p => {
                const opt = document.createElement('option')
                opt.value = p.nome
                opt.textContent = p.nome
                filtroPor.appendChild(opt)
            })
        }
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
        servicos.sort((a,b) => a.id - b.id)
        this.render.renderizarTabela(
            servicos,
            (id) => this.editarServico(id),
            (id, status) => this.toggleStatus(id, status)
        )
    }
    async editarServico(id) {
        this.modal.abrirEditar(id, {
            onSuccess: () => this.carregarServicos(),
            onError: (erro) => this.notification.mostrarErro(erro)
        })
    }
    async salvarServico() {
        this.modal.salvar({
            onSuccess: () => {
                this.notification.mostrarSucesso('Serviço salvo com sucesso!')
                this.carregarServicos()
            },
            onError: (erro) => this.notification.mostrarErro(erro)
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const instance = new ServicoFrontController()
        window.servicoFrontController = instance
        window.ServicosController = instance
        window.servicosController = instance
    })
} else {
    const instance = new ServicoFrontController()
    window.servicoFrontController = instance
    window.ServicosController = instance
    window.servicosController = instance
}
