class ModalTipoUsuario {
    constructor(apiBaseUrl, httpService) {
        this.API_BASE_URL = apiBaseUrl
        this.http = httpService
        this._modal = null
        this.render = new TipoUsuarioRender()
        this.modalService = new ModalService()
        this.currentCallback = { onSuccess: null, onError: null }
        this.init()
    }

    async init() {
        await this.ensureTemplates()
        this.setupModalEvents()
    }

    async ensureTemplates() {
        this.modalService.ensureElement('modalTipoUsuario', () => this.render.getModalTemplates())
    }

    setupModalEvents() {
        const modalEl = document.getElementById('modalTipoUsuario')
        if (modalEl) {
            if (modalEl.dataset.listenersAttached) return

            modalEl.addEventListener('hidden.bs.modal', () => {
                this.limparFormulario()
            })

            modalEl.dataset.listenersAttached = 'true'
        }
    }

    limparFormulario() {
        const form = document.getElementById('formTipoUsuario')
        if (form) {
            form.reset()
            const idEl = document.getElementById('tipoUsuarioId')
            if (idEl) idEl.value = ''
        }
        this.limparErros()
    }

    limparErros() {
        const campo = document.getElementById('formTipoUsuario')
        if (campo) {
            campo.querySelectorAll('.invalid-feedback').forEach(el => el.style.display = 'none')
            campo.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('is-invalid'))
        }
    }

    async abrir(onSuccess) {
        this.currentCallback = ModalService.normalizeCallbacks(onSuccess)
        await this.ensureTemplates()

        const tituloEl = document.getElementById('modalTipoUsuarioTitulo')
        if (tituloEl) tituloEl.textContent = 'Novo Tipo de Usuário'

        this.limparFormulario()

        const statusEl = document.getElementById('statusTipoUsuario')
        if (statusEl) {
            statusEl.value = 'Ativo'
            statusEl.setAttribute('disabled', 'disabled')
        }

        if (this._modal) {
            try { this._modal.hide() } catch (e) { }
            this._modal = null
        }

        this._modal = this.modalService.createBootstrapModal('modalTipoUsuario')
        if (!this._modal) return

        const btn = document.getElementById('btnSalvarTipoUsuario')
        if (btn) {
            const newBtn = btn.cloneNode(true)
            btn.parentNode.replaceChild(newBtn, btn)
            newBtn.addEventListener('click', () => this.salvar())
        }

        this._modal.show()
    }

    async abrirEditar(id, onSuccess) {
        try {
            this.currentCallback = ModalService.normalizeCallbacks(onSuccess)
            await this.ensureTemplates()

            const tipo = await this.http.get(`/tiposUsuarios/${id}`)

            const tituloEl = document.getElementById('modalTipoUsuarioTitulo')
            if (tituloEl) tituloEl.textContent = 'Editar Tipo de Usuário'

            const idEl = document.getElementById('tipoUsuarioId')
            if (idEl) idEl.value = id

            const tipoEl = document.getElementById('tipoTipoUsuario')
            if (tipoEl) tipoEl.value = tipo.tipo

            const statusEl = document.getElementById('statusTipoUsuario')
            if (statusEl) {
                statusEl.value = tipo.status
                statusEl.removeAttribute('disabled')
            }

            if (this._modal) {
                try { this._modal.hide() } catch (e) { }
                this._modal = null
            }

            this._modal = this.modalService.createBootstrapModal('modalTipoUsuario')
            if (!this._modal) return

            const btn = document.getElementById('btnSalvarTipoUsuario')
            if (btn) {
                const newBtn = btn.cloneNode(true)
                btn.parentNode.replaceChild(newBtn, btn)
                newBtn.addEventListener('click', () => this.salvar())
            }

            this._modal.show()
        } catch (erro) {
            console.error('Erro ao abrir modal de edição:', erro)
            const callbacks = ModalService.mergeCallbacks(onSuccess, this.currentCallback)
            if (callbacks.onError) {
                callbacks.onError(erro.message || 'Erro ao abrir modal de edição.')
            }
        }
    }

    async salvar(onSuccess) {
        const callbacks = ModalService.mergeCallbacks(onSuccess, this.currentCallback)
        const id = document.getElementById('tipoUsuarioId').value
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
            this.modalService.showMessage('modalTipoUsuarioMensagem', `Tipo de usuário ${id ? 'atualizado' : 'criado'} com sucesso!`, 'success', 1500)
            setTimeout(() => {
                if (this._modal) {
                    this._modal.hide()
                }
                const form = document.getElementById('formTipoUsuario')
                if (form) form.reset()
                if (callbacks.onSuccess) {
                    callbacks.onSuccess()
                }
                this.currentCallback = ModalService.normalizeCallbacks()
            }, 1500)
        } catch (erro) {
            this.modalService.showMessage('modalTipoUsuarioMensagem', erro.message || 'Erro ao salvar tipo de usuário.', 'danger', 4000)
            if (callbacks.onError) {
                callbacks.onError(erro.message || 'Erro ao salvar tipo de usuário.')
            }
        }
    }

    _ensureMessageContainer() {
        const id = 'modalTipoUsuarioMensagem'
        let el = document.getElementById(id)
        if (!el) {
            const modalEl = document.getElementById('modalTipoUsuario')
            if (!modalEl) return
            const body = modalEl.querySelector('.modal-body')
            if (!body) return
            el = document.createElement('div')
            el.id = id
            el.className = 'alert d-none'
            body.insertBefore(el, body.firstChild)
        }
    }
}

window.ModalTipoUsuario = ModalTipoUsuario
