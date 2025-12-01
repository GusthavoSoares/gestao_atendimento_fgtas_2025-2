class ModalServico {
    constructor(apiBaseUrl, httpService) {
        this.API_BASE_URL = apiBaseUrl
        this.http = httpService
        this.validation = new ValidationService()
        this.portfolios = []
        this._modal = null
        this.carregarPortfolios()
    }
    get modal() {
        if (!this._modal) {
            const element = document.getElementById('modalServico')
            if (element) {
                this._modal = new bootstrap.Modal(element)
            }
        }
        return this._modal
    }
    async carregarPortfolios() {
        try {
            this.portfolios = await this.http.get('/portfolios')
        } catch (erro) {
            console.error('Erro ao carregar portfólios:', erro)
        }
    }
    preencherSelectPortfolios() {
        const select = document.getElementById('portfolioServico')
        if (!select) return
        select.innerHTML = '<option value="">Selecione...</option>'
        this.portfolios.forEach(portfolio => {
            const option = document.createElement('option')
            option.value = portfolio.id
            option.textContent = portfolio.nome
            select.appendChild(option)
        })
    }
    abrir() {
        this.limparFormulario()
        this.limparErros()
        this.vincularListeners()
        const servicoId = document.getElementById('servicoId')
        const titulo = document.getElementById('modalServicoTitulo')
        if (servicoId) servicoId.value = ''
        if (titulo) titulo.textContent = 'Novo Serviço'
        this.preencherSelectPortfolios()
        this.modal.show()
    }
    async abrirEditar(id, onSuccess) {
        try {
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
            this.modal.show()
        } catch (erro) {
            if (onSuccess && onSuccess.onError) {
                onSuccess.onError(erro.message)
            }
        }
    }
    async salvar(onSuccess) {
        const id = document.getElementById('servicoId').value
        const dados = {
            nome: document.getElementById('nomeServico').value,
            id_portfolio: document.getElementById('portfolioServico').value || null,
            status: document.getElementById('statusServico').value
        }
        this.limparErros()
        this.limparMensagem()
        let invalido = false
        if (!dados.nome || dados.nome.trim().length < 3) {
            this.mostrarErroCampo('nome', 'Nome é obrigatório (mín. 3 caracteres).')
            invalido = true
        }
        if (!dados.id_portfolio) {
            this.mostrarErroCampo('portfolio_id', 'Portfólio é obrigatório.')
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
                await this.http.put(`/servicos/${id}`, dados)
            } else {
                await this.http.post('/servicos', dados)
            }
            this.mostrarMensagem(`Serviço ${id ? 'atualizado' : 'criado'} com sucesso!`, 'success')
            setTimeout(() => {
                this.modal.hide()
                const callback = onSuccess || this.currentCallback
                if (typeof callback === 'function') {
                    callback()
                }
                this.currentCallback = null
            }, 1500)
        } catch (erro) {
            this.mostrarMensagem(erro.message || 'Erro ao salvar serviço.', 'danger')
        }
    }
    limparFormulario() {
        document.getElementById('formServico').reset()
        this.limparMensagem()
    }
    limparMensagem() {
        const msgEl = document.getElementById('modalServicoMensagem')
        if (msgEl) {
            msgEl.className = 'alert d-none'
            msgEl.textContent = ''
        }
    }
    mostrarMensagem(texto, tipo = 'success') {
        const msgEl = document.getElementById('modalServicoMensagem')
        if (!msgEl) return
        msgEl.className = `alert alert-${tipo}`
        msgEl.textContent = texto
        setTimeout(() => this.limparMensagem(), 4000)
    }
    limparErros() {
        const campos = ['nomeServico','portfolioServico','statusServico']
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
        ['nomeServico','portfolioServico','statusServico'].forEach(id => {
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
