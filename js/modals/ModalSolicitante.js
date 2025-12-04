class ModalSolicitante {
    constructor(apiBaseUrl, httpService) {
        this.API_BASE_URL = apiBaseUrl
        this.http = httpService
        this.validation = new ValidationService()
        this.tiposSolicitantes = []
        this._modal = null
        this.render = new SolicitanteRender()
        this.modalService = new ModalService()
        this.currentCallback = null
        this.init()
    }

    async init() {
        await this.carregarDados()
        await this.ensureTemplates()
        this.setupModalEvents()
    }

    async carregarDados() {
        try {
            this.tiposSolicitantes = await this.http.get('/tiposSolicitantes')
        } catch (erro) {
            console.error('Erro ao carregar dados:', erro)
        }
    }

    async ensureTemplates() {
        this.modalService.ensureElement('modalSolicitante', () => this.render.getModalTemplates())
    }

    setupModalEvents() {
        const modalEl = document.getElementById('modalSolicitante')
        if (modalEl) {
            if (modalEl.dataset.listenersAttached) return

            modalEl.addEventListener('show.bs.modal', () => {
                this.preencherSelects()
            })

            modalEl.addEventListener('hidden.bs.modal', () => {
                this.limparFormulario()
            })

            modalEl.dataset.listenersAttached = 'true'
        }
    }

    preencherSelects() {
        const tipoSelect = document.getElementById('tipoSolicitanteSolicitante')

        if (tipoSelect) {
            if (tipoSelect.options.length > 1) return

            tipoSelect.innerHTML = '<option value="">Selecione...</option>'
            this.tiposSolicitantes.forEach(tipo => {
                const option = document.createElement('option')
                option.value = tipo.id
                option.textContent = tipo.tipo
                tipoSelect.appendChild(option)
            })
        }
    }

    limparFormulario() {
        const form = document.getElementById('formSolicitante')
        if (form) {
            form.reset()
            const idEl = document.getElementById('solicitanteId')
            if (idEl) idEl.value = ''
        }
        this.limparErros()
    }

    limparErros() {
        const campo = document.getElementById('formSolicitante')
        if (campo) {
            campo.querySelectorAll('.invalid-feedback').forEach(el => el.style.display = 'none')
            campo.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('is-invalid'))
        }
    }

    vincularListeners() {
        const form = document.getElementById('formSolicitante')
        if (!form) return

        form.addEventListener('input', (e) => {
            if (e.target.classList.contains('is-invalid')) {
                e.target.classList.remove('is-invalid')
                const feedback = e.target.parentElement.querySelector('.invalid-feedback')
                if (feedback) feedback.style.display = 'none'
            }
        })
    }

    async abrir(onSuccess) {
        this.currentCallback = onSuccess
        await this.ensureTemplates()
        this.preencherSelects()

        const solicitanteId = document.getElementById('solicitanteId')
        const titulo = document.getElementById('modalSolicitanteTitulo')
        if (solicitanteId) solicitanteId.value = ''
        if (titulo) titulo.textContent = 'Novo Solicitante'

        this.limparErros()
        this.vincularListeners()

        if (this._modal) {
            try { this._modal.hide() } catch (e) { }
            this._modal = null
        }

        this._modal = this.modalService.createBootstrapModal('modalSolicitante')
        if (!this._modal) return

        const btn = document.getElementById('btnSalvarSolicitante')
        if (btn) {
            const newBtn = btn.cloneNode(true)
            btn.parentNode.replaceChild(newBtn, btn)
            newBtn.addEventListener('click', () => this.salvar(onSuccess))
        }

        this._modal.show()
    }

    async abrirEditar(id, optionsOrCallback) {
        try {
            const onSuccess = (typeof optionsOrCallback === 'object' && optionsOrCallback) ? optionsOrCallback.onSuccess : optionsOrCallback
            this.currentCallback = onSuccess

            await this.ensureTemplates()
            this.preencherSelects()

            const solicitante = await this.http.get(`/solicitantes/${id}`)

            const titulo = document.getElementById('modalSolicitanteTitulo')
            if (titulo) titulo.textContent = 'Editar Solicitante'

            this.limparErros()
            this.vincularListeners()

            if (this._modal) {
                try { this._modal.hide() } catch (e) { }
                this._modal = null
            }

            this._modal = this.modalService.createBootstrapModal('modalSolicitante')
            if (!this._modal) return

            const btn = document.getElementById('btnSalvarSolicitante')
            if (btn) {
                const newBtn = btn.cloneNode(true)
                btn.parentNode.replaceChild(newBtn, btn)
                newBtn.addEventListener('click', () => this.salvar(onSuccess))
            }

            const setIf = (elId, val) => {
                const el = document.getElementById(elId)
                if (el != null) {
                    const isSelect = el.tagName === 'SELECT'
                    const normalized = isSelect && val != null ? String(val) : (val ?? '')
                    el.value = normalized
                }
            }

            setIf('solicitanteId', solicitante.id)
            setIf('nomeSolicitante', solicitante.nome)
            setIf('tipoSolicitanteSolicitante', solicitante.id_tipo_solicitante)
            setIf('identificacaoSolicitante', solicitante.identificacao)

            let dataNasc = solicitante.data_nascimento
            if (dataNasc) {
                const dateObj = new Date(dataNasc)
                if (!isNaN(dateObj)) {
                    const day = String(dateObj.getUTCDate()).padStart(2, '0')
                    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0')
                    const year = dateObj.getUTCFullYear()
                    dataNasc = `${day}/${month}/${year}`
                }
            }
            setIf('dataNascimentoSolicitante', dataNasc)

            setIf('telefoneSolicitante', solicitante.telefone)
            setIf('emailSolicitante', solicitante.email)
            setIf('cepSolicitante', solicitante.cep)
            setIf('enderecoSolicitante', solicitante.endereco)
            setIf('statusSolicitante', solicitante.status)

            this._modal.show()
        } catch (erro) {
            console.error('Erro ao carregar solicitante:', erro)
            this.modalService.showMessage('modalSolicitanteMensagem', 'Erro ao carregar dados do solicitante', 'danger', 4000)
        }
    }

    async salvar(onSuccess) {
        const id = document.getElementById('solicitanteId').value

        let dataNascimento = document.getElementById('dataNascimentoSolicitante').value
        if (dataNascimento && dataNascimento.includes('/')) {
            const parts = dataNascimento.split('/')
            if (parts.length === 3) {
                dataNascimento = `${parts[2]}-${parts[1]}-${parts[0]}`
            }
        }

        const dados = {
            nome: document.getElementById('nomeSolicitante').value,
            id_tipo_solicitante: document.getElementById('tipoSolicitanteSolicitante').value,
            identificacao: document.getElementById('identificacaoSolicitante').value,
            data_nascimento: dataNascimento,
            telefone: document.getElementById('telefoneSolicitante').value,
            email: document.getElementById('emailSolicitante').value,
            cep: document.getElementById('cepSolicitante').value,
            endereco: document.getElementById('enderecoSolicitante').value,
            status: document.getElementById('statusSolicitante').value
        }

        try {
            if (id) {
                await this.http.put(`/solicitantes/${id}`, dados)
            } else {
                await this.http.post('/solicitantes', dados)
            }
            this.modalService.showMessage('modalSolicitanteMensagem', `Solicitante ${id ? 'atualizado' : 'criado'} com sucesso!`, 'success', 1500)
            setTimeout(() => {
                if (this._modal) {
                    this._modal.hide()
                }
                this.limparFormulario()
                const callback = onSuccess || this.currentCallback
                if (typeof callback === 'function') {
                    callback()
                }
                this.currentCallback = null
            }, 1500)
        } catch (erro) {
            this.modalService.showMessage('modalSolicitanteMensagem', erro.message || 'Erro ao salvar solicitante', 'danger', 4000)
        }
    }
}
window.ModalSolicitante = ModalSolicitante
