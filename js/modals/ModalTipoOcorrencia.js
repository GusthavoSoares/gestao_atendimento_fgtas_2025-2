class ModalTipoOcorrencia {
    constructor(apiBaseUrl, httpService) {
        this.API_BASE_URL = apiBaseUrl
        this.http = httpService
        this.currentCallback = { onSuccess: null, onError: null }
        this._modal = null
        this.render = new TipoOcorrenciaRender()
        this.modalService = new ModalService()
        this.init()
    }

    async init() {
        await this.ensureTemplates()
        this.setupModalEvents()
    }

    async ensureTemplates() {
        this.modalService.ensureElement('modalTipoOcorrencia', () => this.render.getModalTemplates())
    }

    setupModalEvents() {
        const modalEl = document.getElementById('modalTipoOcorrencia')
        if (modalEl) {
            if (modalEl.dataset.listenersAttached) return

            modalEl.addEventListener('hidden.bs.modal', () => {
                this.limparFormulario()
            })

            modalEl.dataset.listenersAttached = 'true'
        }
    }

    limparFormulario() {
        const form = document.getElementById('formTipoOcorrencia')
        if (form) {
            form.reset()
            const idEl = document.getElementById('tipoOcorrenciaId')
            if (idEl) idEl.value = ''
        }
        this.limparErros()
    }

    limparErros() {
        const campo = document.getElementById('formTipoOcorrencia')
        if (campo) {
            campo.querySelectorAll('.invalid-feedback').forEach(el => el.style.display = 'none')
            campo.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('is-invalid'))
        }
    }

    async abrir(onSuccess) {
        this.currentCallback = ModalService.normalizeCallbacks(onSuccess)
        await this.ensureTemplates()

        const titulo = document.getElementById('modalTipoOcorrenciaTitulo')
        if (titulo) titulo.textContent = 'Novo Tipo de Ocorrência'

        this.limparFormulario()

        if (this._modal) {
            try { this._modal.hide() } catch (e) { }
            this._modal = null
        }

        this._modal = this.modalService.createBootstrapModal('modalTipoOcorrencia')
        if (!this._modal) return

        const btn = document.getElementById('btnSalvarTipoOcorrencia')
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

            const tipo = await this.http.get(`/tiposOcorrencias/${id}`)

            const titulo = document.getElementById('modalTipoOcorrenciaTitulo')
            if (titulo) titulo.textContent = 'Editar Tipo de Ocorrência'

            const idEl = document.getElementById('tipoOcorrenciaId')
            if (idEl) idEl.value = id

            const descEl = document.getElementById('descricaoOcorrencia')
            if (descEl) descEl.value = tipo.tipo || tipo.descricao

            if (this._modal) {
                try { this._modal.hide() } catch (e) { }
                this._modal = null
            }

            this._modal = this.modalService.createBootstrapModal('modalTipoOcorrencia')
            if (!this._modal) return

            const btn = document.getElementById('btnSalvarTipoOcorrencia')
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
        const id = document.getElementById('tipoOcorrenciaId').value
        const dados = {
            tipo: document.getElementById('descricaoOcorrencia').value
        }
        try {
            if (id) {
                await this.http.put(`/tiposOcorrencias/${id}`, dados)
            } else {
                await this.http.post('/tiposOcorrencias', dados)
            }
            this.modalService.showMessage('modalTipoOcorrenciaMensagem', `Tipo de ocorrência ${id ? 'atualizado' : 'criado'} com sucesso!`, 'success', 1500)
            setTimeout(() => {
                if (this._modal) {
                    this._modal.hide()
                }
                const form = document.getElementById('formTipoOcorrencia')
                if (form) form.reset()
                if (callbacks.onSuccess) {
                    callbacks.onSuccess()
                }
                this.currentCallback = ModalService.normalizeCallbacks()
            }, 1500)
        } catch (erro) {
            this.modalService.showMessage('modalTipoOcorrenciaMensagem', erro.message || 'Erro ao salvar tipo de ocorrência.', 'danger', 4000)
            if (callbacks.onError) {
                callbacks.onError(erro.message || 'Erro ao salvar tipo de ocorrência.')
            }
        }
    }

    _renderTemplate() {
        // templates provided by TipoOcorrenciaRender.getModalTemplates()
    }

    _ensureMessageContainer() {
        const id = 'modalTipoOcorrenciaMensagem'
        let el = document.getElementById(id)
        if (!el) {
            const modalEl = document.getElementById('modalTipoOcorrencia')
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
        this.modalService.showMessage('modalTipoOcorrenciaMensagem', texto, tipo, 4000)
    }
}
window.ModalTipoOcorrencia = ModalTipoOcorrencia

// template now provided by render when needed
