class TipoOcorrenciaFrontController {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8001'
        this.http = new HttpService(this.API_BASE_URL)
        this.notification = new NotificationService()
        this.modal = new ModalTipoOcorrencia(this.API_BASE_URL, this.http)
        this.render = new TipoOcorrenciaRender()
        this.inicializar()
    }
    async inicializar() {
        await this.carregarTiposOcorrencia()
        BotoesFiltroRender.renderizarBotoes('botoesFiltroContainer', false)
        BotoesFiltroRender.configurarEventos(
            null,
            async () => {
                await this.carregarTiposOcorrencia()
                this.notification.mostrarSucesso('Dados recarregados com sucesso!')
            }
        )
        document.getElementById('btnSalvarTipoOcorrencia').addEventListener('click', () => this.salvarTipoOcorrencia())
    }
    async carregarTiposOcorrencia() {
        try {
            const tipos = await this.http.get('/tiposOcorrencias')
            this.renderizarTabelaOcorrencia(tipos)
        } catch (erro) {
            this.notification.mostrarErro('Erro ao carregar tipos de ocorrência')
        }
    }
    renderizarTabelaOcorrencia(tipos) {
        this.render.renderizarTabela(
            tipos,
            (id) => this.editarTipoOcorrencia(id),
            (id) => this.deletarTipoOcorrencia(id)
        )
    }
    async editarTipoOcorrencia(id) {
        this.modal.abrirEditar(id, {
            onError: (erro) => this.notification.mostrarErro('Erro ao carregar tipo')
        })
    }
    async salvarTipoOcorrencia() {
        this.modal.salvar({
            onSuccess: () => {
                this.notification.mostrarSucesso('Tipo salvo com sucesso!')
                this.carregarTiposOcorrencia()
            },
            onError: (erro) => this.notification.mostrarErro(erro)
        })
    }
    async deletarTipoOcorrencia(id) {
        if (!confirm('Deseja realmente excluir este tipo de ocorrência?')) {
            return
        }
        try {
            await this.http.delete(`/tiposOcorrencias/${id}`)
            this.notification.mostrarSucesso('Tipo excluído com sucesso!')
            await this.carregarTiposOcorrencia()
        } catch (erro) {
            this.notification.mostrarErro('Erro ao excluir tipo')
        }
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const instance = new TipoOcorrenciaFrontController()
        window.tipoOcorrenciaFrontController = instance
    })
} else {
    const instance = new TipoOcorrenciaFrontController()
    window.tipoOcorrenciaFrontController = instance
}
