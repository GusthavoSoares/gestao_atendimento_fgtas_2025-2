class SolicitanteFrontController {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8001'
        this.solicitantes = []
        this.tiposSolicitante = []
        this.editandoId = null
        this.http = new HttpService(this.API_BASE_URL)
        this.notification = new NotificationService()
        this.dateService = new DateService()
        this.validation = new ValidationService()
        this.modal = new ModalSolicitante(this.API_BASE_URL, this.http, this.dateService)
        this.render = new SolicitanteRender(this.dateService, this.validation)
        this.filtroRender = new FiltroRender()
        this.filtroController = new FiltroController((filtros) => this.aplicarFiltros(filtros))
        this.inicializar()
    }
    async inicializar() {
        try {
            await this.carregarTiposSolicitante()
            await this.carregarSolicitantes()
            BotoesFiltroRender.renderizarBotoes('botoesFiltroContainer')
            this.configurarFiltros()
            document.getElementById('btnSalvarSolicitante').addEventListener('click', () => this.salvarSolicitante())
        } catch (erro) {
            console.error('Erro na inicialização:', erro)
            this.notification.mostrarErro('Erro ao carregar dados: ' + erro.message)
        }
    }
    async carregarTiposSolicitante() {
        try {
            this.tiposSolicitante = await this.http.get('/tiposSolicitantes')
            this.filtroRender.renderizarSelectTipo('filtroTipo', this.tiposSolicitante)
        } catch (erro) {
            console.error('Erro ao carregar tipos de solicitante:', erro)
            this.notification.mostrarErro('Erro ao carregar tipos de solicitante')
        }
    }
    async carregarSolicitantes() {
        try {
            this.solicitantes = await this.http.get('/solicitantes')
            this.filtroRender.renderizarSelectStatus('filtroStatus', this.solicitantes.map(s => s.status))
            this.renderizarTabela()
        } catch (erro) {
            console.error('Erro ao carregar solicitantes:', erro)
            this.notification.mostrarErro('Erro ao carregar solicitantes')
        }
    }
    configurarFiltros() {
        this.filtroController.registrarFiltro('status', 'todos')
        this.filtroController.registrarFiltro('tipo', 'todos')
        this.filtroController.configurarSelect('filtroStatus', 'status')
        this.filtroController.configurarSelect('filtroTipo', 'tipo')
        const btnAplicar = document.getElementById('btnAplicarFiltros')
        if (btnAplicar) btnAplicar.classList.add('d-none')
        
        BotoesFiltroRender.configurarEventos(
            () => this.filtroController.limparFiltros(),
            async () => {
                await this.carregarSolicitantes()
                this.notification.mostrarSucesso('Dados recarregados com sucesso!')
            }
        )
    }
    aplicarFiltros(filtros) {
        this.renderizarTabela(filtros)
    }
    renderizarTabela(filtros = null) {
        let solicitantes = [...this.solicitantes]
        const filtroStatus = filtros ? filtros.status : this.filtroController.obterValorFiltro('status')
        const filtroTipo = filtros ? filtros.tipo : this.filtroController.obterValorFiltro('tipo')
        
        if (filtroStatus && filtroStatus !== 'todos') {
            solicitantes = solicitantes.filter(s => {
                const status = (s.status || '').trim()
                return status.toLowerCase() === filtroStatus.toLowerCase()
            })
        }
        if (filtroTipo && filtroTipo !== 'todos') {
            solicitantes = solicitantes.filter(s => s.id_tipo_solicitante == filtroTipo)
        }
        solicitantes.sort((a,b) => a.id - b.id)
        this.render.renderizarTabela(
            solicitantes,
            (id) => this.editarSolicitante(id),
            (id, status) => this.toggleStatus(id, status)
        )
    }
    async editarSolicitante(id) {
        this.modal.abrirEditar(id, {
            onSuccess: () => this.carregarSolicitantes(),
            onError: (erro) => this.notification.mostrarErro(erro)
        })
    }
    async salvarSolicitante() {
        this.modal.salvar({
            onSuccess: () => {
                this.notification.mostrarSucesso('Solicitante salvo com sucesso!')
                this.carregarSolicitantes()
            },
            onError: (erro) => this.notification.mostrarErro(erro)
        })
    }
    async toggleStatus(id, statusAtual) {
        if (!confirm(`Deseja realmente ${statusAtual === 'Ativo' ? 'desativar' : 'ativar'} este solicitante?`)) {
            return
        }
        try {
            const novoStatus = statusAtual === 'Ativo' ? 'Inativo' : 'Ativo'
            await this.http.put(`/solicitantes/${id}`, { status: novoStatus })
            this.notification.mostrarSucesso('Status atualizado com sucesso!')
            await this.carregarSolicitantes()
        } catch (erro) {
            this.notification.mostrarErro('Erro ao atualizar status')
        }
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const instance = new SolicitanteFrontController()
        window.solicitanteFrontController = instance
        window.SolicitantesController = instance
        window.solicitantesController = instance
    })
} else {
    const instance = new SolicitanteFrontController()
    window.solicitanteFrontController = instance
    window.SolicitantesController = instance
    window.solicitantesController = instance
}
