class ModalTipoSolicitante {
    constructor(apiBaseUrl, httpService) {
        this.API_BASE_URL = apiBaseUrl
        this.http = httpService
        this.editandoId = null
        this.currentCallback = null
        this._modal = null
    }
    get modal() {
        if (!this._modal) {
            const element = document.getElementById('modalTipoSolicitante')
            if (element) {
                this._modal = new bootstrap.Modal(element, { keyboard: true })
            }
        }
        return this._modal
    }
    abrir() {
        this.editandoId = null
        this.currentCallback = null
        document.getElementById('modalTipoSolicitanteTitulo').textContent = 'Novo Tipo de Solicitante'
        document.getElementById('formTipoSolicitante').reset()
        document.getElementById('tipoSolicitanteId').value = ''
        this.modal.show()
    }
    async abrirEditar(id, callback) {
        this.editandoId = id
        this.currentCallback = callback
        try {
            const tipo = await this.http.get(`/tiposSolicitantes/${id}`)
            document.getElementById('modalTipoSolicitanteTitulo').textContent = 'Editar Tipo de Solicitante'
            document.getElementById('tipoSolicitanteId').value = id
            document.getElementById('tipoSolicitante').value = tipo.tipo
            document.getElementById('statusSolicitante').value = tipo.status
            this.modal.show()
        } catch (erro) {
            if (callback?.onError) {
                callback.onError(erro)
            }
        }
    }
    async salvar(callback) {
        const id = this.editandoId
        const dados = {
            tipo: document.getElementById('tipoSolicitante').value,
            status: document.getElementById('statusSolicitante').value
        }
        try {
            if (id) {
                await this.http.put(`/tiposSolicitantes/${id}`, dados)
            } else {
                await this.http.post('/tiposSolicitantes', dados)
            }
            this.modal.hide()
            const finalCallback = callback || this.currentCallback
            if (finalCallback) {
                if (typeof finalCallback === 'function') {
                    finalCallback()
                } else if (finalCallback.onSuccess) {
                    finalCallback.onSuccess()
                }
            }
            this.currentCallback = null
        } catch (erro) {
            if (callback?.onError) {
                callback.onError(erro)
            }
        }
    }
}
window.ModalTipoSolicitante = ModalTipoSolicitante
