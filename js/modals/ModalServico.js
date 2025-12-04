class ModalServico {
    constructor(apiBaseUrl, httpService) {
        this.API_BASE_URL = apiBaseUrl
        this.http = httpService
        this.validation = new ValidationService()
        this.portfolios = []
        this._modal = null
        this.render = new ServicoRender()
        this.modalService = new ModalService()
        this.currentCallback = { onSuccess: null, onError: null }
        this.init()
    }

    async init() {
        await this.carregarPortfolios()
        await this.ensureTemplates()
        this.setupModalEvents()
    }

    async ensureTemplates() {
        this.modalService.ensureElement('modalServico', () => this.render.getModalTemplates())
    }

    async carregarPortfolios() {
        try {
            this.portfolios = await this.http.get('/portfolios')
        } catch (erro) {
            console.error('Erro ao carregar portfólios:', erro)
        }
    }

    setupModalEvents() {
        const modalEl = document.getElementById('modalServico')
        if (modalEl) {
            if (modalEl.dataset.listenersAttached) return

            modalEl.addEventListener('show.bs.modal', () => {
                this.preencherSelectPortfolios()
            })

            modalEl.addEventListener('hidden.bs.modal', () => {
                this.limparFormulario()
            })

            modalEl.dataset.listenersAttached = 'true'
        }
    }

    preencherSelectPortfolios() {
        const select = document.getElementById('portfolioServico')
        if (!select) return

        if (select.options.length > 1) return

        select.innerHTML = '<option value="">Selecione...</option>'
        this.portfolios.forEach(portfolio => {
            const option = document.createElement('option')
            option.value = portfolio.id
            option.textContent = portfolio.nome
            select.appendChild(option)
        })
    }

    limparFormulario() {
        const form = document.getElementById('formServico')
        if (form) {
            form.reset()
            const idEl = document.getElementById('servicoId')
            if (idEl) idEl.value = ''
        }
        this.limparErros()
    }

    limparErros() {
        const campo = document.getElementById('formServico')
        if (campo) {
            campo.querySelectorAll('.invalid-feedback').forEach(el => el.style.display = 'none')
            campo.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('is-invalid'))
        }
    }

    vincularListeners() {
        const form = document.getElementById('formServico')
        if (!form) return

        form.addEventListener('input', (e) => {
            if (e.target.classList.contains('is-invalid')) {
                e.target.classList.remove('is-invalid')
                const feedback = e.target.parentElement.querySelector('.invalid-feedback')
                if (feedback) feedback.style.display = 'none'
            }
        })
    }

    mostrarErroCampo(campoId, mensagem) {
        const campo = document.getElementById(campoId)
        if (campo) {
            campo.classList.add('is-invalid')
            const feedback = campo.parentElement.querySelector('.invalid-feedback')
            if (feedback) {
                feedback.textContent = mensagem
                feedback.style.display = 'block'
            }
        }
    }

    async abrir(onSuccess) {
        this.currentCallback = ModalService.normalizeCallbacks(onSuccess)
        await this.ensureTemplates()
        this.preencherSelectPortfolios()

        const servicoId = document.getElementById('servicoId')
        const titulo = document.getElementById('modalServicoTitulo')
        if (servicoId) servicoId.value = ''
        if (titulo) titulo.textContent = 'Novo Serviço'

        this.limparErros()
        this.vincularListeners()

        if (this._modal) {
            try { this._modal.hide() } catch (e) { }
            this._modal = null
        }

        this._modal = this.modalService.createBootstrapModal('modalServico')
        if (!this._modal) return

        const btn = document.getElementById('btnSalvarServico')
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
            this.preencherSelectPortfolios()

            const servico = await this.http.get(`/servicos/${id}`)

            document.getElementById('servicoId').value = servico.id
            document.getElementById('nomeServico').value = servico.nome
            document.getElementById('portfolioServico').value = servico.id_portfolio
            document.getElementById('statusServico').value = servico.status

            const titulo = document.getElementById('modalServicoTitulo')
            if (titulo) titulo.textContent = 'Editar Serviço'

            this.limparErros()
            this.vincularListeners()

            if (this._modal) {
                try { this._modal.hide() } catch (e) { }
                this._modal = null
            }

            this._modal = this.modalService.createBootstrapModal('modalServico')
            if (!this._modal) return

            const btn = document.getElementById('btnSalvarServico')
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
        const id = document.getElementById('servicoId').value
        const dados = {
            nome: document.getElementById('nomeServico').value,
            id_portfolio: document.getElementById('portfolioServico').value || null,
            status: document.getElementById('statusServico').value
        }
        this.limparErros()
        this.modalService.clearMessage('modalServicoMensagem')

        let invalido = false
        if (!dados.nome || dados.nome.trim().length < 3) {
            this.mostrarErroCampo('nomeServico', 'Nome é obrigatório (mín. 3 caracteres).')
            invalido = true
        }
        if (!dados.id_portfolio) {
            this.mostrarErroCampo('portfolioServico', 'Portfólio é obrigatório.')
            invalido = true
        }
        if (!dados.status) {
            this.mostrarErroCampo('statusServico', 'Status é obrigatório.')
            invalido = true
        }
        if (invalido) {
            this.modalService.showMessage('modalServicoMensagem', 'Corrija os erros antes de salvar.', 'danger', 4000)
            return
        }
        try {
            if (id) {
                await this.http.put(`/servicos/${id}`, dados)
            } else {
                await this.http.post('/servicos', dados)
            }
            this.modalService.showMessage('modalServicoMensagem', `Serviço ${id ? 'atualizado' : 'criado'} com sucesso!`, 'success', 1500)
            setTimeout(() => {
                // Usar instância armazenada do modal
                if (this._modal) {
                    this._modal.hide()
                }
                this.limparFormulario()
                if (callbacks.onSuccess) {
                    callbacks.onSuccess()
                }
                this.currentCallback = ModalService.normalizeCallbacks()
            }, 1500)
        } catch (erro) {
            this.modalService.showMessage('modalServicoMensagem', erro.message || 'Erro ao salvar serviço.', 'danger', 4000)
            if (callbacks.onError) {
                callbacks.onError(erro.message || 'Erro ao salvar serviço.')
            }
        }
    }
    limparFormulario() {
        const form = document.getElementById('formServico')
        if (form) form.reset()

        // Garantir que o ID seja limpo
        const servicoId = document.getElementById('servicoId')
        if (servicoId) servicoId.value = ''

        this.modalService.clearMessage('modalServicoMensagem')
    }
    limparErros() {
        const campos = ['nomeServico', 'portfolioServico', 'statusServico']
        campos.forEach(id => {
            const el = document.getElementById(id)
            if (!el) return
            el.classList.remove('is-invalid')
            const feedback = el.parentElement && el.parentElement.querySelector('.invalid-feedback')
            if (feedback) feedback.remove()
        })
    }
    mostrarErroCampo(idCampo, mensagem) {
        const el = document.getElementById(idCampo)
        if (!el) return
        el.classList.add('is-invalid')
        const feedback = document.createElement('div')
        feedback.className = 'invalid-feedback'
        feedback.textContent = mensagem
        if (el.parentElement) {
            el.parentElement.appendChild(feedback)
        }
    }
    vincularListeners() {
        ['nomeServico', 'portfolioServico', 'statusServico'].forEach(id => {
            const el = document.getElementById(id)
            if (!el) return
            const evt = id === 'portfolioServico' || id === 'statusServico' ? 'change' : 'input'
            el.addEventListener(evt, () => {
                el.classList.remove('is-invalid')
                const fb = el.parentElement && el.parentElement.querySelector('.invalid-feedback')
                if (fb) fb.remove()
            })
        })
    }
}
window.ModalServico = ModalServico
