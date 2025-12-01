class TipoSolicitanteFrontController {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8001'
        this.tiposSolicitanteOriginal = []
        this.filtroStatusSolicitante = 'todos'
        this.http = new HttpService(this.API_BASE_URL)
        this.notification = new NotificationService()
        this.filtroRender = new FiltroRender()
        this.modal = new ModalTipoSolicitante(this.API_BASE_URL, this.http)
        this.render = new TipoSolicitanteRender()
        this.inicializar()
    }
    async inicializar() {
        await this.carregarTiposSolicitante()
        
        // Aguarda o DOM estar pronto antes de renderizar botões
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.configurarInterface()
            })
        } else {
            this.configurarInterface()
        }
    }
    
    configurarInterface() {
        BotoesFiltroRender.renderizarBotoes('botoesFiltroContainer')
        BotoesFiltroRender.configurarEventos(
            () => this.limparFiltrosSolicitante(),
            async () => {
                await this.carregarTiposSolicitante()
                this.notification.mostrarSucesso('Dados recarregados com sucesso!')
            }
        )
        document.getElementById('btnSalvarTipoSolicitante').addEventListener('click', () => this.salvarTipoSolicitante())
        const filtroStatus = document.getElementById('filtroStatusSolicitante')
        if (filtroStatus) {
            const renderDebounced = (typeof debounce === 'function')
                ? debounce(() => this.aplicarFiltroSolicitante(), 120)
                : () => this.aplicarFiltroSolicitante()
            filtroStatus.addEventListener('change', (e) => {
                this.filtroStatusSolicitante = e.target.value
                renderDebounced()
            })
        }
    }
    limparFiltrosSolicitante() {
        this.filtroStatusSolicitante = 'todos'
        const filtroStatus = document.getElementById('filtroStatusSolicitante')
        if (filtroStatus) filtroStatus.value = 'todos'
        this.aplicarFiltroSolicitante()
    }
    async carregarTiposSolicitante() {
        try {
            this.tiposSolicitanteOriginal = await this.http.get('/tiposSolicitantes')
            this.filtroRender.renderizarSelectStatus('filtroStatusSolicitante', this.tiposSolicitanteOriginal.map(t => t.status))
            this.aplicarFiltroSolicitante()
        } catch (erro) {
            this.notification.mostrarErro('Erro ao carregar tipos de solicitante')
        }
    }
    aplicarFiltroSolicitante() {
        let tipos = [...this.tiposSolicitanteOriginal]
        if (this.filtroStatusSolicitante !== 'todos') {
            tipos = tipos.filter(t => {
                const status = (t.status || '').trim()
                return status.toLowerCase() === this.filtroStatusSolicitante.toLowerCase()
            })
        }
        this.renderizarTabelaSolicitante(tipos)
    }
    renderizarTabelaSolicitante(tipos) {
        this.render.renderizarTabela(
            tipos,
            (id) => this.editarTipoSolicitante(id),
            (id, status) => this.toggleStatusSolicitante(id, status)
        )
    }
    async editarTipoSolicitante(id) {
        this.modal.abrirEditar(id, {
            onError: (erro) => this.notification.mostrarErro('Erro ao carregar tipo')
        })
    }
    async salvarTipoSolicitante() {
        this.modal.salvar({
            onSuccess: () => this.carregarTiposSolicitante(),
            onError: (erro) => this.notification.mostrarErro('Erro ao salvar tipo')
        })
    }
    async toggleStatusSolicitante(id, statusAtual) {
        if (!confirm(`Deseja realmente ${statusAtual === 'Ativo' ? 'desativar' : 'ativar'} este tipo?`)) {
            return
        }
        try {
            const novoStatus = statusAtual === 'Ativo' ? 'Inativo' : 'Ativo'
            await this.http.put(`/tiposSolicitantes/${id}`, { status: novoStatus })
            this.notification.mostrarSucesso('Status atualizado com sucesso!')
            await this.carregarTiposSolicitante()
        } catch (erro) {
            this.notification.mostrarErro('Erro ao atualizar status')
        }
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const instance = new TipoSolicitanteFrontController()
        window.tipoSolicitanteFrontController = instance
    })
} else {
    const instance = new TipoSolicitanteFrontController()
    window.tipoSolicitanteFrontController = instance
}
