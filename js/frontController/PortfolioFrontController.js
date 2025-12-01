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
            document.getElementById('btnSalvarPortfolio').addEventListener('click', () => this.salvarPortfolio())
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
            () => this.filtroController.limparFiltros(),
            async () => {
                await this.carregarPortfolios()
                this.notification.mostrarSucesso('Dados recarregados com sucesso!')
            }
        )
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
        portfolios.sort((a,b) => a.id - b.id)
        this.render.renderizarTabela(
            portfolios,
            (id) => this.editarPortfolio(id),
            (id) => this.toggleStatus(id)
        )
    }
    async editarPortfolio(id) {
        await this.modal.abrirEditar(id, {
            onError: (mensagem) => this.notification.mostrarErro(mensagem)
        })
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const instance = new PortfolioFrontController()
        window.portfolioFrontController = instance
        window.PortfoliosController = instance
        window.portfoliosController = instance
    })
} else {
    const instance = new PortfolioFrontController()
    window.portfolioFrontController = instance
    window.PortfoliosController = instance
    window.portfoliosController = instance
}
