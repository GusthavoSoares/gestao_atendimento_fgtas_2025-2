class ModalTipoUsuario {
    constructor(apiBaseUrl, httpService) {
        this.API_BASE_URL = apiBaseUrl
        this.http = httpService
        this.editandoId = null
        this._modal = null
    }
    get modal() {
        if (!this._modal) {
            const element = document.getElementById('modalTipoUsuario')
            if (element) {
                this._modal = new bootstrap.Modal(element, { keyboard: true })
            }
        }
        return this._modal
    }
    abrir() {
        this.editandoId = null
        document.getElementById('modalTipoUsuarioTitulo').textContent = 'Novo Tipo de Usuário'
        document.getElementById('formTipoUsuario').reset()
        document.getElementById('tipoUsuarioId').value = ''
        const statusEl = document.getElementById('statusTipoUsuario')
        if (statusEl) {
            statusEl.value = 'Ativo'
            statusEl.setAttribute('disabled', 'disabled')
        }
        this.modal.show()
    }
    async abrirEditar(id, callback) {
        try {
            const tipo = await this.http.get(`/tiposUsuarios/${id}`)
            this.editandoId = id
            document.getElementById('modalTipoUsuarioTitulo').textContent = 'Editar Tipo de Usuário'
            document.getElementById('tipoUsuarioId').value = id
            document.getElementById('tipoTipoUsuario').value = tipo.tipo
            document.getElementById('statusTipoUsuario').value = tipo.status
            const statusEl = document.getElementById('statusTipoUsuario')
            if (statusEl) {
                statusEl.removeAttribute('disabled')
            }
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
            tipo: document.getElementById('tipoTipoUsuario').value,
            status: id ? document.getElementById('statusTipoUsuario').value : 'Ativo'
        }
        try {
            if (id) {
                await this.http.put(`/tiposUsuarios/${id}`, dados)
            } else {
                await this.http.post('/tiposUsuarios', dados)
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
window.ModalTipoUsuario = ModalTipoUsuario
