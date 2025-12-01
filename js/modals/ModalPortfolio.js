class ModalPortfolio {
    constructor(apiBaseUrl, httpService) {
        this.API_BASE_URL = apiBaseUrl
        this.http = httpService
        this.validation = new ValidationService()
        this.tiposSolicitante = []
        this._modal = null
        this.carregarTiposSolicitante()
    }
    get modal() {
        if (!this._modal) {
            const element = document.getElementById('modalPortfolio')
            if (element) {
                this._modal = new bootstrap.Modal(element)
            }
        }
        return this._modal
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
    async abrir() {
        this.limparFormulario()
        this.limparErros()
        this.vincularListeners()
        const portfolioId = document.getElementById('portfolioId')
        const titulo = document.getElementById('modalPortfolioTitulo')
        if (portfolioId) portfolioId.value = ''
        if (titulo) titulo.textContent = 'Novo Portfólio'
        this.preencherSelectTipos()
        this.modal.show()
    }
    async abrirEditar(id, onSuccess) {
        try {
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
            this.modal.show()
        } catch (erro) {
            if (onSuccess && onSuccess.onError) {
                onSuccess.onError(erro.message)
            }
        }
    }
    async salvar(onSuccess) {
        const id = document.getElementById('portfolioId').value
        const dados = {
            nome: document.getElementById('nomePortfolio').value,
            id_tipo_solicitante: document.getElementById('tipoSolicitantePortfolio').value || null,
            status: document.getElementById('statusPortfolio').value
        }
        this.limparErros()
        this.limparMensagem()
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
            this.mostrarMensagem('Corrija os erros antes de salvar.', 'danger')
            return
        }
        try {
            if (id) {
                await this.http.put(`/portfolios/${id}`, dados)
            } else {
                await this.http.post('/portfolios', dados)
            }
            this.mostrarMensagem(`Portfólio ${id ? 'atualizado' : 'criado'} com sucesso!`, 'success')
            setTimeout(() => {
                this.modal.hide()
                const callback = onSuccess || this.currentCallback
                if (typeof callback === 'function') {
                    callback()
                }
                this.currentCallback = null
            }, 1500)
        } catch (erro) {
            this.mostrarMensagem(erro.message || 'Erro ao salvar portfólio.', 'danger')
        }
    }
    limparFormulario() {
        document.getElementById('formPortfolio').reset()
        this.limparMensagem()
    }
    limparMensagem() {
        const msgEl = document.getElementById('modalPortfolioMensagem')
        if (msgEl) {
            msgEl.className = 'alert d-none'
            msgEl.textContent = ''
        }
    }
    mostrarMensagem(texto, tipo = 'success') {
        const msgEl = document.getElementById('modalPortfolioMensagem')
        if (!msgEl) return
        msgEl.className = `alert alert-${tipo}`
        msgEl.textContent = texto
        setTimeout(() => this.limparMensagem(), 4000)
    }
    limparErros() {
        const campos = ['nomePortfolio','tipoSolicitantePortfolio','statusPortfolio']
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
        ['nomePortfolio','tipoSolicitantePortfolio','statusPortfolio'].forEach(id => {
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
