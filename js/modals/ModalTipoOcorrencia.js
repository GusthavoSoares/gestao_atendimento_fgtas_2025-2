class ModalTipoOcorrencia {
    constructor(apiBaseUrl, httpService) {
        this.API_BASE_URL = apiBaseUrl
        this.http = httpService
        this.editandoId = null
        this.currentCallback = null
        this._modal = null
    }
    get modal() {
        if (!this._modal) {
            const element = document.getElementById('modalTipoOcorrencia')
            if (element) {
                this._modal = new bootstrap.Modal(element, { keyboard: true })
            }
        }
        return this._modal
    }
    abrir() {
        this.editandoId = null
        this.currentCallback = null
        document.getElementById('modalTipoOcorrenciaTitulo').textContent = 'Novo Tipo de Ocorrência'
        document.getElementById('formTipoOcorrencia').reset()
        document.getElementById('tipoOcorrenciaId').value = ''
        this.modal.show()
    }
    async abrirEditar(id, callback) {
        try {
            this.currentCallback = callback
            const tipo = await this.http.get(`/tiposOcorrencias/${id}`)
            this.editandoId = id
            document.getElementById('modalTipoOcorrenciaTitulo').textContent = 'Editar Tipo de Ocorrência'
            document.getElementById('tipoOcorrenciaId').value = id
            document.getElementById('descricaoOcorrencia').value = tipo.tipo || tipo.descricao
            this.modal.show()
            if (callback?.onSuccess) callback.onSuccess()
        } catch (erro) {
            if (callback?.onError) {
                callback.onError(erro)
            }
        }
    }
    async salvar(callback) {
        const id = this.editandoId
        const dados = {
            tipo: document.getElementById('descricaoOcorrencia').value
        }
        try {
            console.log('ModalTipoOcorrencia.salvar payload:', { id, dados })
            if (id) {
                const resp = await this.http.put(`/tiposOcorrencias/${id}`, dados)
                console.log('PUT resposta:', resp)
            } else {
                const resp = await this.http.post('/tiposOcorrencias', dados)
                console.log('POST resposta:', resp)
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
window.ModalTipoOcorrencia = ModalTipoOcorrencia
