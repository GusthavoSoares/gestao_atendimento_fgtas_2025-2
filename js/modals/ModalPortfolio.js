class ModalPortfolio {
    constructor(apiBaseUrl, httpService) {
        this.API_BASE_URL = apiBaseUrl
        this.http = httpService
        this.validation = new ValidationService()
        this.tiposSolicitante = []
        this._modal = null
        this.render = new PortfolioRender()
        this.modalService = new ModalService()
        this.currentCallback = { onSuccess: null, onError: null }
        this.carregarTiposSolicitante()
    }

    async ensureTemplates() {
        this.modalService.ensureElement('modalPortfolio', () => this.render.getModalTemplates())
    }

    async carregarTiposSolicitante() {
        try {
            this.tiposSolicitante = await this.http.get('/tiposSolicitantes')
        } catch (erro) {
            console.error('Erro ao carregar tipos de solicitante:', erro)
        }
    }
    preencherSelectTipos() {
        const select = document.getElementById('tipoSolicitantePortfolio')
        if (!select) return
        select.innerHTML = '<option value="">Selecione...</option>'
        this.tiposSolicitante.forEach(tipo => {
            const option = document.createElement('option')
            option.value = tipo.id
            option.textContent = tipo.tipo
            select.appendChild(option)
        })
    }
    async abrir(onSuccess) {
        this.currentCallback = ModalService.normalizeCallbacks(onSuccess)
        await this.ensureTemplates()
        this.preencherSelectTipos()

        const portfolioId = document.getElementById('portfolioId')
        const titulo = document.getElementById('modalPortfolioTitulo')
        if (portfolioId) portfolioId.value = ''
        if (titulo) titulo.textContent = 'Novo Portfólio'

        this.limparErros()
        this.vincularListeners()

        // Destruir modal anterior se existir
        if (this._modal) {
            try {
                this._modal.hide()
            } catch (e) {
                console.log('Modal anterior já estava oculto')
            }
            this._modal = null
        }

        this._modal = this.modalService.createBootstrapModal('modalPortfolio')
        if (!this._modal) {
            console.error('Erro: Não foi possível criar o modal')
            return
        }

        const btn = document.getElementById('btnSalvarPortfolio')
        if (btn) {
            // Remover listeners anteriores
            const newBtn = btn.cloneNode(true)
            btn.parentNode.replaceChild(newBtn, btn)
            newBtn.addEventListener('click', () => this.salvar())
        }

        // Adicionar listeners para o botão cancelar e fechar (X)
        const modalElement = this._modal?._element
        if (modalElement) {
            const cancelarBtn = modalElement.querySelector('[data-bs-dismiss="modal"]')
            if (cancelarBtn) {
                const newCancelar = cancelarBtn.cloneNode(true)
                cancelarBtn.parentNode.replaceChild(newCancelar, cancelarBtn)
                newCancelar.addEventListener('click', () => {
                    this._modal?.hide()
                    this.limparFormulario()
                })
            }
        }

        this._modal.show()
    }
    async abrirEditar(id, onSuccess) {
        try {
            this.currentCallback = ModalService.normalizeCallbacks(onSuccess)
            await this.ensureTemplates()
            this.preencherSelectTipos()

            const portfolio = await this.http.get(`/portfolios/${id}`)

            document.getElementById('portfolioId').value = portfolio.id
            document.getElementById('nomePortfolio').value = portfolio.nome
            document.getElementById('tipoSolicitantePortfolio').value = portfolio.id_tipo_solicitante
            document.getElementById('statusPortfolio').value = portfolio.status

            const titulo = document.getElementById('modalPortfolioTitulo')
            if (titulo) titulo.textContent = 'Editar Portfólio'

            this.limparErros()
            this.vincularListeners()

            // Destruir modal anterior se existir
            if (this._modal) {
                try {
                    this._modal.hide()
                } catch (e) {
                    console.log('Modal anterior já estava oculto')
                }
                this._modal = null
            }

            this._modal = this.modalService.createBootstrapModal('modalPortfolio')
            if (!this._modal) {
                console.error('Erro: Não foi possível criar o modal de edição')
                return
            }

            const btn = document.getElementById('btnSalvarPortfolio')
            if (btn) {
                // Remover listeners anteriores
                const newBtn = btn.cloneNode(true)
                btn.parentNode.replaceChild(newBtn, btn)
                newBtn.addEventListener('click', () => this.salvar())
            }

            // Adicionar listeners para o botão cancelar e fechar (X)
            const modalElement = this._modal?._element
            if (modalElement) {
                const cancelarBtn = modalElement.querySelector('[data-bs-dismiss="modal"]')
                if (cancelarBtn) {
                    const newCancelar = cancelarBtn.cloneNode(true)
                    cancelarBtn.parentNode.replaceChild(newCancelar, cancelarBtn)
                    newCancelar.addEventListener('click', () => {
                        this._modal?.hide()
                        this.limparFormulario()
                    })
                }
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
        const id = document.getElementById('portfolioId').value
        const dados = {
            nome: document.getElementById('nomePortfolio').value,
            id_tipo_solicitante: document.getElementById('tipoSolicitantePortfolio').value || null,
            status: document.getElementById('statusPortfolio').value
        }
        this.limparErros()
        this.modalService.clearMessage('modalPortfolioMensagem')
        let invalido = false
        if (!dados.nome || dados.nome.trim().length < 3) {
            this.mostrarErroCampo('nome', 'Nome é obrigatório (mín. 3 caracteres).')
            invalido = true
        }
        if (!dados.id_tipo_solicitante) {
            this.mostrarErroCampo('tipo_solicitante_id', 'Tipo de solicitante é obrigatório.')
            invalido = true
        }
        if (!dados.status) {
            this.mostrarErroCampo('status', 'Status é obrigatório.')
            invalido = true
        }
        if (invalido) {
            this.modalService.showMessage('modalPortfolioMensagem', 'Corrija os erros antes de salvar.', 'danger', 4000)
            return
        }
        try {
            if (id) {
                await this.http.put(`/portfolios/${id}`, dados)
            } else {
                await this.http.post('/portfolios', dados)
            }
            this.modalService.showMessage('modalPortfolioMensagem', `Portfólio ${id ? 'atualizado' : 'criado'} com sucesso!`, 'success', 1500)
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
            this.modalService.showMessage('modalPortfolioMensagem', erro.message || 'Erro ao salvar portfólio.', 'danger', 4000)
            if (callbacks.onError) {
                callbacks.onError(erro.message || 'Erro ao salvar portfólio.')
            }
        }
    }
    limparFormulario() {
        const form = document.getElementById('formPortfolio')
        if (form) form.reset()
        this.modalService.clearMessage('modalPortfolioMensagem')
    }
    limparErros() {
        const campos = ['nomePortfolio', 'tipoSolicitantePortfolio', 'statusPortfolio']
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
        ['nomePortfolio', 'tipoSolicitantePortfolio', 'statusPortfolio'].forEach(id => {
            const el = document.getElementById(id)
            if (!el) return
            const evt = id === 'tipoSolicitantePortfolio' || id === 'statusPortfolio' ? 'change' : 'input'
            el.addEventListener(evt, () => {
                el.classList.remove('is-invalid')
                const fb = el.parentElement && el.parentElement.querySelector('.invalid-feedback')
                if (fb) fb.remove()
            })
        })
    }
}
window.ModalPortfolio = ModalPortfolio
