class ModalSolicitante {
    constructor(apiBaseUrl, httpService, dateService) {
        this.API_BASE_URL = apiBaseUrl
        this.http = httpService
        this.dateService = dateService
        this.validation = new ValidationService()
        this.tiposSolicitante = []
        this._modal = null
        this.carregarTiposSolicitante()
    }
    get modal() {
        if (!this._modal) {
            const element = document.getElementById('modalSolicitante')
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
        const select = document.getElementById('tipoSolicitanteSolicitante')
        if (!select) return
        select.innerHTML = '<option value="">Selecione...</option>'
        this.tiposSolicitante.forEach(tipo => {
            const option = document.createElement('option')
            option.value = tipo.id
            option.textContent = tipo.tipo
            select.appendChild(option)
        })
    }
    abrir() {
        this.limparFormulario()
        this.limparErros()
        this.vincularListeners()
        const solicitanteId = document.getElementById('solicitanteId')
        const titulo = document.getElementById('modalSolicitanteTitulo')
        if (solicitanteId) solicitanteId.value = ''
        if (titulo) titulo.textContent = 'Novo Solicitante'
        this.preencherSelectTipos()
        this.modal.show()
    }
    async abrirEditar(id, onSuccess) {
        try {
            this.preencherSelectTipos()
            const solicitante = await this.http.get(`/solicitantes/${id}`)
            document.getElementById('solicitanteId').value = solicitante.id
            document.getElementById('nomeSolicitante').value = solicitante.nome
            document.getElementById('tipoSolicitanteSolicitante').value = solicitante.id_tipo_solicitante
            document.getElementById('identificacaoSolicitante').value = solicitante.identificacao || ''
            document.getElementById('dataNascimentoSolicitante').value = this.dateService.formatarDataBRParaInput(solicitante.data_nascimento)
            document.getElementById('telefoneSolicitante').value = solicitante.telefone || ''
            document.getElementById('emailSolicitante').value = solicitante.email || ''
            document.getElementById('cepSolicitante').value = solicitante.cep || ''
            document.getElementById('enderecoSolicitante').value = solicitante.endereco || ''
            document.getElementById('statusSolicitante').value = solicitante.status
            const titulo = document.getElementById('modalSolicitanteTitulo')
            if (titulo) titulo.textContent = 'Editar Solicitante'
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
        const id = document.getElementById('solicitanteId').value
        const dados = {
            nome: document.getElementById('nomeSolicitante').value,
            id_tipo_solicitante: document.getElementById('tipoSolicitanteSolicitante').value || null,
            identificacao: document.getElementById('identificacaoSolicitante').value || null,
            data_nascimento: this.dateService.parseDataBRParaISO(document.getElementById('dataNascimentoSolicitante').value) || null,
            telefone: document.getElementById('telefoneSolicitante').value || null,
            email: document.getElementById('emailSolicitante').value,
            cep: document.getElementById('cepSolicitante').value || null,
            endereco: document.getElementById('enderecoSolicitante').value,
            status: document.getElementById('statusSolicitante').value
        }
        if (dados.identificacao) dados.identificacao = dados.identificacao.replace(/\D/g,'')
        if (dados.telefone) dados.telefone = dados.telefone.replace(/\D/g,'')
        if (dados.cep) dados.cep = dados.cep.replace(/\D/g,'')
        this.limparErros()
        this.limparMensagem()
        let invalido = false
        if (!dados.nome || dados.nome.trim().length < 3) {
            this.mostrarErroCampo('nomeSolicitante', 'Nome é obrigatório (mín. 3 caracteres).')
            invalido = true
        }
        if (!dados.id_tipo_solicitante) {
            this.mostrarErroCampo('tipoSolicitanteSolicitante', 'Tipo de solicitante é obrigatório.')
            invalido = true
        }
        if (dados.identificacao && !this.validation.validarCPF(dados.identificacao) && dados.identificacao.length !== 14) {
            this.mostrarErroCampo('identificacaoSolicitante', 'CPF ou CNPJ inválido.')
            invalido = true
        }
        if (dados.telefone && !this.validation.validarTelefone(dados.telefone)) {
            this.mostrarErroCampo('telefoneSolicitante', 'Telefone inválido.')
            invalido = true
        }
        if (!dados.email || !this.validation.validarEmail(dados.email)) {
            this.mostrarErroCampo('emailSolicitante', 'Email é obrigatório e deve ser válido.')
            invalido = true
        }
        if (!dados.endereco || dados.endereco.trim().length < 3) {
            this.mostrarErroCampo('enderecoSolicitante', 'Endereço é obrigatório.')
            invalido = true
        }
        if (dados.cep && !this.validation.validarCEP(dados.cep)) {
            this.mostrarErroCampo('cepSolicitante', 'CEP inválido.')
            invalido = true
        }
        if (!dados.status) {
            this.mostrarErroCampo('statusSolicitante', 'Status é obrigatório.')
            invalido = true
        }
        if (invalido) {
            this.mostrarMensagem('Corrija os erros antes de salvar.', 'danger')
            return
        }
        try {
            if (id) {
                await this.http.put(`/solicitantes/${id}`, dados)
            } else {
                await this.http.post('/solicitantes', dados)
            }
            this.mostrarMensagem(`Solicitante ${id ? 'atualizado' : 'criado'} com sucesso!`, 'success')
            setTimeout(() => {
                this.modal.hide()
                const callback = onSuccess || this.currentCallback
                if (typeof callback === 'function') {
                    callback()
                }
                this.currentCallback = null
            }, 1500)
        } catch (erro) {
            this.mostrarMensagem(erro.message || 'Erro ao salvar solicitante.', 'danger')
        }
    }
    limparFormulario() {
        document.getElementById('formSolicitante').reset()
        this.limparMensagem()
    }
    limparMensagem() {
        const msgEl = document.getElementById('modalSolicitanteMensagem')
        if (msgEl) {
            msgEl.className = 'alert d-none'
            msgEl.textContent = ''
        }
    }
    mostrarMensagem(texto, tipo = 'success') {
        const msgEl = document.getElementById('modalSolicitanteMensagem')
        if (!msgEl) return
        msgEl.className = `alert alert-${tipo}`
        msgEl.textContent = texto
        setTimeout(() => this.limparMensagem(), 4000)
    }
    limparErros() {
        const campos = ['nomeSolicitante','tipoSolicitanteSolicitante','identificacaoSolicitante','dataNascimentoSolicitante','telefoneSolicitante','emailSolicitante','cepSolicitante','enderecoSolicitante','statusSolicitante']
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
        const clear = (id) => {
            const el = document.getElementById(id)
            if (!el) return
            el.addEventListener('input', () => {
                el.classList.remove('is-invalid')
                const feedback = el.parentElement && el.parentElement.querySelector('.invalid-feedback')
                if (feedback) feedback.remove()
            })
        }
        ['nomeSolicitante','tipoSolicitanteSolicitante','identificacaoSolicitante','dataNascimentoSolicitante','telefoneSolicitante','emailSolicitante','cepSolicitante','enderecoSolicitante','statusSolicitante'].forEach(clear)
        const idEl = document.getElementById('identificacaoSolicitante')
        if (idEl) {
            idEl.addEventListener('input', () => {
                const raw = idEl.value.replace(/\D/g,'')
                if (raw.length <= 11) {
                    idEl.value = this.validation.formatarCPF(raw)
                } else if (raw.length <= 14) {
                    idEl.value = this.validation.formatarCNPJ(raw)
                }
            })
        }
        const telEl = document.getElementById('telefoneSolicitante')
        if (telEl) {
            telEl.addEventListener('input', () => {
                telEl.value = this.validation.formatarTelefone(telEl.value)
            })
        }
        const cepEl = document.getElementById('cepSolicitante')
        if (cepEl) {
            cepEl.addEventListener('input', () => {
                cepEl.value = this.validation.formatarCEP(cepEl.value)
            })
        }
        const dataEl = document.getElementById('dataNascimentoSolicitante')
        if (dataEl) {
            dataEl.addEventListener('input', () => {
                let v = dataEl.value.replace(/\D/g,'').slice(0,8)
                if (v.length >= 5) dataEl.value = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`
                else if (v.length >= 3) dataEl.value = `${v.slice(0,2)}/${v.slice(2)}`
                else dataEl.value = v
            })
        }
    }
}
window.ModalSolicitante = ModalSolicitante
