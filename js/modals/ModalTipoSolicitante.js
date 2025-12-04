class ModalTipoSolicitante {
    constructor(apiBaseUrl, httpService) {
        this.API_BASE_URL = apiBaseUrl
        this.http = httpService
        this.currentCallback = { onSuccess: null, onError: null }
        this._modal = null
        this.render = new TipoSolicitanteRender()
        this.modalService = new ModalService()
        this.init()
    }

    async init() {
        await this.ensureTemplates()
        this.setupModalEvents()
    }

    async ensureTemplates() {
        this.modalService.ensureElement('modalTipoSolicitante', () => this.render.getModalTemplates())
    }

    setupModalEvents() {
        const modalEl = document.getElementById('modalTipoSolicitante')
        if (modalEl) {
            if (modalEl.dataset.listenersAttached) return

            modalEl.addEventListener('hidden.bs.modal', () => {
                this.limparFormulario()
            })

            modalEl.dataset.listenersAttached = 'true'
        }
    }

    limparFormulario() {
        const form = document.getElementById('formTipoSolicitante')
        if (form) {
            form.reset()
            const idEl = document.getElementById('tipoSolicitanteId')
            if (idEl) idEl.value = ''
        }
        this.limparErros()
    }

    limparErros() {
        const campo = document.getElementById('formTipoSolicitante')
        if (campo) {
            campo.querySelectorAll('.invalid-feedback').forEach(el => el.style.display = 'none')
            campo.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('is-invalid'))
        }
    }

    async abrir(onSuccess) {
        this.currentCallback = ModalService.normalizeCallbacks(onSuccess)
        await this.ensureTemplates()

        const titulo = document.getElementById('modalTipoSolicitanteTitulo')
        if (titulo) titulo.textContent = 'Novo Tipo de Solicitante'

        this.limparFormulario()

        if (this._modal) {
            try { this._modal.hide() } catch (e) { }
            this._modal = null
        }

        this._modal = this.modalService.createBootstrapModal('modalTipoSolicitante')
        if (!this._modal) return

        const btn = document.getElementById('btnSalvarTipoSolicitante')
        if (btn) {
            const newBtn = btn.cloneNode(true)
            btn.parentNode.replaceChild(newBtn, btn)
            newBtn.addEventListener('click', () => this.salvar())
        }

        this._modal.show()
    }

    async abrirEditar(id, onSuccess) {
        this.currentCallback = ModalService.normalizeCallbacks(onSuccess)
        try {
            await this.ensureTemplates()

            const tipo = await this.http.get(`/tiposSolicitantes/${id}`)

            const titulo = document.getElementById('modalTipoSolicitanteTitulo')
            if (titulo) titulo.textContent = 'Editar Tipo de Solicitante'

            const idEl = document.getElementById('tipoSolicitanteId')
            if (idEl) idEl.value = id

            const tipoEl = document.getElementById('tipoSolicitante')
            if (tipoEl) tipoEl.value = tipo.tipo

            const statusEl = document.getElementById('statusSolicitante')
            if (statusEl) statusEl.value = tipo.status

            if (this._modal) {
                try { this._modal.hide() } catch (e) { }
                this._modal = null
            }

            this._modal = this.modalService.createBootstrapModal('modalTipoSolicitante')
            if (!this._modal) return

            const btn = document.getElementById('btnSalvarTipoSolicitante')
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
        const id = document.getElementById('tipoSolicitanteId').value
        const dados = {
            tipo: document.getElementById('tipoSolicitante').value,
            status: id ? document.getElementById('statusSolicitante').value : 'Ativo'
        }
        try {
            if (id) {
                await this.http.put(`/tiposSolicitantes/${id}`, dados)
            } else {
                await this.http.post('/tiposSolicitantes', dados)
            }
            this.modalService.showMessage('modalTipoSolicitanteMensagem', `Tipo de solicitante ${id ? 'atualizado' : 'criado'} com sucesso!`, 'success', 1500)
            setTimeout(() => {
                if (this._modal) {
                    this._modal.hide()
                }
                const form = document.getElementById('formTipoSolicitante')
                if (form) form.reset()
                if (callbacks.onSuccess) {
                    callbacks.onSuccess()
                }
                this.currentCallback = ModalService.normalizeCallbacks()
            }, 1500)
        } catch (erro) {
            this.modalService.showMessage('modalTipoSolicitanteMensagem', erro.message || 'Erro ao salvar tipo de solicitante.', 'danger', 4000)
            if (callbacks.onError) {
                callbacks.onError(erro.message || 'Erro ao salvar tipo de solicitante.')
            }
        }
    }

    _renderTemplate() {
        // templates provided by TipoSolicitanteRender.getModalTemplates()
    }

    _ensureMessageContainer() {
        const id = 'modalTipoSolicitanteMensagem'
        let el = document.getElementById(id)
        if (!el) {
            const modalEl = document.getElementById('modalTipoSolicitante')
            if (!modalEl) return
            const body = modalEl.querySelector('.modal-body')
            if (!body) return
            el = document.createElement('div')
            el.id = id
            el.className = 'alert d-none'
            body.insertBefore(el, body.firstChild)
        }
    }

    mostrarMensagem(texto, tipo = 'success') {
        this.modalService.showMessage('modalTipoSolicitanteMensagem', texto, tipo, 4000)
    }
}
window.ModalTipoSolicitante = ModalTipoSolicitante


