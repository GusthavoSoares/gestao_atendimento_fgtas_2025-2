class ModalUsuario {
    constructor(apiBaseUrl, httpService, dateService) {
        this.API_BASE_URL = apiBaseUrl
        this.http = httpService
        this.dateService = dateService
        this.validation = new ValidationService()
        this.tiposUsuarios = []
        this._modalCriar = null
        this._modalEditar = null
        this.currentCallback = null
    }
    get modalCriar() {
        if (!this._modalCriar) {
            const element = document.getElementById('modalCriarUsuario')
            if (element) {
                this._modalCriar = new bootstrap.Modal(element)
            }
        }
        return this._modalCriar
    }
    get modalEditar() {
        if (!this._modalEditar) {
            const element = document.getElementById('modalEditarUsuario')
            if (element) {
                this._modalEditar = new bootstrap.Modal(element)
            }
        }
        return this._modalEditar
    }
    async carregarTiposUsuarios() {
        try {
            this.tiposUsuarios = await this.http.get('/tiposUsuarios')
        } catch (erro) {
            console.error('Erro ao carregar tipos de usuários:', erro)
        }
    }
    preencherSelectTipos(selectId) {
        const select = document.getElementById(selectId)
        if (!select) return
        select.innerHTML = '<option value="">Selecione...</option>'
        this.tiposUsuarios.forEach(tipo => {
            const option = document.createElement('option')
            option.value = tipo.id
            option.textContent = tipo.tipo
            select.appendChild(option)
        })
    }
    abrirCriar() {
        this.currentCallback = null
        this.limparFormCriar()
        this.limparErrosCriar()
        this.preencherSelectTipos('tipoUsuarioCriar')
        this.vincularListenersCriar()
        const statusEl = document.getElementById('statusCriar')
        if (statusEl) {
            statusEl.value = 'Ativo'
            statusEl.setAttribute('disabled', 'disabled')
        }
        this.modalCriar.show()
    }
    async abrirEditar(id, onSuccess) {
        try {
            this.currentCallback = onSuccess
            this.preencherSelectTipos('tipoUsuarioEdit')
            const usuario = await this.http.get(`/usuarios/${id}`)
            document.getElementById('usuarioIdEdit').value = usuario.id
            document.getElementById('nomeEdit').value = usuario.nome
            document.getElementById('emailEdit').value = usuario.email
            document.getElementById('tipoUsuarioEdit').value = usuario.id_tipo_usuario
            document.getElementById('statusEdit').value = usuario.status
            document.getElementById('cpfEdit').value = usuario.cpf || ''
            document.getElementById('dataNascimentoEdit').value = this.dateService.formatarDataBRParaInput(usuario.data_nascimento)
            document.getElementById('telefoneEdit').value = usuario.telefone || ''
            document.getElementById('cepEdit').value = usuario.cep || ''
            document.getElementById('enderecoEdit').value = usuario.endereco || ''
            this.limparErrosEditar()
            this.vincularListenersEditar()
            this.modalEditar.show()
        } catch (erro) {
            if (onSuccess && onSuccess.onError) {
                onSuccess.onError(erro.message)
            }
        }
    }
    async criar(onSuccess) {
        const dados = {
            nome: document.getElementById('nomeCriar').value,
            email: document.getElementById('emailCriar').value,
            id_tipo_usuario: document.getElementById('tipoUsuarioCriar').value || null,
            status: 'Ativo',
            cpf: document.getElementById('cpfCriar').value || null,
            data_nascimento: this.dateService.parseDataBRParaISO(document.getElementById('dataNascimentoCriar').value) || null,
            telefone: document.getElementById('telefoneCriar').value || null,
            cep: document.getElementById('cepCriar').value || null,
            endereco: document.getElementById('enderecoCriar').value,
            senha: document.getElementById('senhaCriar').value
        }
        if (dados.cpf) dados.cpf = dados.cpf.replace(/\D/g,'')
        if (dados.telefone) dados.telefone = dados.telefone.replace(/\D/g,'')
        if (dados.cep) dados.cep = dados.cep.replace(/\D/g,'')
        this.limparErrosCriar()
        this.limparMensagemCriar()
        let invalido = false
        if (!dados.nome || dados.nome.trim().length < 3) { this.mostrarErroCampo('nomeCriar','Nome é obrigatório (mín. 3 caracteres).'); invalido = true }
        if (!dados.email || !this.validation.validarEmail(dados.email)) { this.mostrarErroCampo('emailCriar','Email é obrigatório e deve ser válido.'); invalido = true }
        if (!dados.id_tipo_usuario) { this.mostrarErroCampo('tipoUsuarioCriar','Tipo de usuário é obrigatório.'); invalido = true }
        if (!dados.status) { this.mostrarErroCampo('statusCriar','Status é obrigatório.'); invalido = true }
        if (!dados.endereco || dados.endereco.trim().length < 3) { this.mostrarErroCampo('enderecoCriar','Endereço é obrigatório.'); invalido = true }
        if (dados.cpf && !this.validation.validarCPF(dados.cpf)) { this.mostrarErroCampo('cpfCriar','CPF inválido.'); invalido = true }
        if (dados.telefone && !this.validation.validarTelefone(dados.telefone)) { this.mostrarErroCampo('telefoneCriar','Telefone inválido.'); invalido = true }
        if (dados.cep && !this.validation.validarCEP(dados.cep)) { this.mostrarErroCampo('cepCriar','CEP inválido.'); invalido = true }
        if (!dados.senha || dados.senha.length < 6) { this.mostrarErroCampo('senhaCriar','Senha é obrigatória (mín. 6 caracteres).'); invalido = true }
        if (invalido) {
            this.mostrarMensagemCriar('Corrija os erros antes de salvar.', 'danger')
            return
        }
        try {
            await this.http.post('/usuarios', dados)
            this.mostrarMensagemCriar('Usuário criado com sucesso!', 'success')
            setTimeout(() => {
                this.modalCriar.hide()
                this.limparFormCriar()
                if (typeof onSuccess === 'function') {
                    onSuccess()
                }
            }, 1500)
        } catch (erro) {
            this.mostrarMensagemCriar(erro.message || 'Erro ao criar usuário.', 'danger')
        }
    }
    async salvarEdicao(onSuccess) {
        const id = document.getElementById('usuarioIdEdit').value
        const dados = {
            nome: document.getElementById('nomeEdit').value,
            email: document.getElementById('emailEdit').value,
            id_tipo_usuario: document.getElementById('tipoUsuarioEdit').value || null,
            status: document.getElementById('statusEdit').value,
            cpf: document.getElementById('cpfEdit').value || null,
            data_nascimento: this.dateService.parseDataBRParaISO(document.getElementById('dataNascimentoEdit').value) || null,
            telefone: document.getElementById('telefoneEdit').value || null,
            cep: document.getElementById('cepEdit').value || null,
            endereco: document.getElementById('enderecoEdit').value
        }
        if (dados.cpf) dados.cpf = dados.cpf.replace(/\D/g,'')
        if (dados.telefone) dados.telefone = dados.telefone.replace(/\D/g,'')
        if (dados.cep) dados.cep = dados.cep.replace(/\D/g,'')
        const senha = document.getElementById('senhaEdit').value
        if (senha) dados.senha = senha
        const usuarioLogado = JSON.parse(localStorage.getItem('usuario'))
        const estaInativandoProprioUsuario = usuarioLogado && usuarioLogado.id === parseInt(id) && dados.status.toLowerCase() === 'inativo'
        if (estaInativandoProprioUsuario) {
            if (!confirm('Você está inativando sua própria conta. Será deslogado automaticamente. Confirma?')) {
                return
            }
        }
        this.limparErrosEditar()
        this.limparMensagemEditar()
        let invalido = false
        if (!dados.nome || dados.nome.trim().length < 3) { this.mostrarErroCampo('nomeEdit','Nome é obrigatório (mín. 3 caracteres).'); invalido = true }
        if (!dados.email || !this.validation.validarEmail(dados.email)) { this.mostrarErroCampo('emailEdit','Email é obrigatório e deve ser válido.'); invalido = true }
        if (!dados.id_tipo_usuario) { this.mostrarErroCampo('tipoUsuarioEdit','Tipo de usuário é obrigatório.'); invalido = true }
        if (!dados.status) { this.mostrarErroCampo('statusEdit','Status é obrigatório.'); invalido = true }
        if (!dados.endereco || dados.endereco.trim().length < 3) { this.mostrarErroCampo('enderecoEdit','Endereço é obrigatório.'); invalido = true }
        if (dados.cpf && !this.validation.validarCPF(dados.cpf)) { this.mostrarErroCampo('cpfEdit','CPF inválido.'); invalido = true }
        if (dados.telefone && !this.validation.validarTelefone(dados.telefone)) { this.mostrarErroCampo('telefoneEdit','Telefone inválido.'); invalido = true }
        if (dados.cep && !this.validation.validarCEP(dados.cep)) { this.mostrarErroCampo('cepEdit','CEP inválido.'); invalido = true }
        if (senha && senha.length < 6) { this.mostrarErroCampo('senhaEdit','Senha deve ter ao menos 6 caracteres.'); invalido = true }
        if (invalido) {
            this.mostrarMensagemEditar('Corrija os erros antes de salvar.', 'danger')
            return
        }
        try {
            await this.http.put(`/usuarios/${id}`, dados)
            this.mostrarMensagemEditar('Usuário atualizado com sucesso!', 'success')
            if (estaInativandoProprioUsuario) {
                setTimeout(() => {
                    this.modalEditar.hide()
                    const callback = onSuccess || this.currentCallback
                    if (typeof callback === 'function') {
                        callback()
                    }
                    this.currentCallback = null
                    localStorage.removeItem('token')
                    localStorage.removeItem('usuario')
                    window.location.href = '../index.html'
                }, 1500)
            } else {
                setTimeout(() => {
                    this.modalEditar.hide()
                    const callback = onSuccess || this.currentCallback
                    if (typeof callback === 'function') {
                        callback()
                    }
                    this.currentCallback = null
                }, 1500)
            }
        } catch (erro) {
            this.mostrarMensagemEditar(erro.message || 'Erro ao atualizar usuário.', 'danger')
        }
    }
    limparFormCriar() {
        document.getElementById('formCriarUsuario').reset()
        this.limparMensagemCriar()
    }
    limparMensagemCriar() {
        const msgEl = document.getElementById('modalCriarUsuarioMensagem')
        if (msgEl) {
            msgEl.className = 'alert d-none'
            msgEl.textContent = ''
        }
    }
    limparMensagemEditar() {
        const msgEl = document.getElementById('modalEditarUsuarioMensagem')
        if (msgEl) {
            msgEl.className = 'alert d-none'
            msgEl.textContent = ''
        }
    }
    mostrarMensagemCriar(texto, tipo = 'success') {
        const msgEl = document.getElementById('modalCriarUsuarioMensagem')
        if (!msgEl) return
        msgEl.className = `alert alert-${tipo}`
        msgEl.textContent = texto
        setTimeout(() => this.limparMensagemCriar(), 4000)
    }
    mostrarMensagemEditar(texto, tipo = 'success') {
        const msgEl = document.getElementById('modalEditarUsuarioMensagem')
        if (!msgEl) return
        msgEl.className = `alert alert-${tipo}`
        msgEl.textContent = texto
        setTimeout(() => this.limparMensagemEditar(), 4000)
    }
    limparErrosCriar() {
        const campos = ['nomeCriar','emailCriar','tipoUsuarioCriar','statusCriar','cpfCriar','dataNascimentoCriar','telefoneCriar','cepCriar','enderecoCriar','senhaCriar']
        campos.forEach(id => {
            const el = document.getElementById(id)
            if (!el) return
            el.classList.remove('is-invalid')
            const feedback = el.parentElement && el.parentElement.querySelector('.invalid-feedback')
            if (feedback) feedback.remove()
        })
    }
    limparErrosEditar() {
        const campos = ['nomeEdit','emailEdit','tipoUsuarioEdit','statusEdit','cpfEdit','dataNascimentoEdit','telefoneEdit','cepEdit','enderecoEdit','senhaEdit']
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
    vincularListenersCriar() {
        const ids = ['nomeCriar','emailCriar','tipoUsuarioCriar','statusCriar','cpfCriar','dataNascimentoCriar','telefoneCriar','cepCriar','enderecoCriar','senhaCriar']
        ids.forEach(id => {
            const el = document.getElementById(id)
            if (!el) return
            el.addEventListener('input', () => {
                el.classList.remove('is-invalid')
                const fb = el.parentElement && el.parentElement.querySelector('.invalid-feedback')
                if (fb) fb.remove()
            })
        })
        
        const cpf = document.getElementById('cpfCriar')
        if (cpf) {
            cpf.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '')
                if (value.length <= 11) {
                    value = value.replace(/(\d{3})(\d)/, '$1.$2')
                    value = value.replace(/(\d{3})(\d)/, '$1.$2')
                    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                    e.target.value = value
                }
            })
        }
        
        const tel = document.getElementById('telefoneCriar')
        if (tel) {
            tel.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '')
                if (value.length <= 11) {
                    if (value.length > 10) {
                        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                    } else if (value.length > 6) {
                        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
                    } else if (value.length > 2) {
                        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2')
                    } else {
                        value = value.replace(/(\d*)/, '($1')
                    }
                    e.target.value = value
                }
            })
        }
        
        const cep = document.getElementById('cepCriar')
        if (cep) {
            cep.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '')
                if (value.length <= 8) {
                    value = value.replace(/(\d{5})(\d)/, '$1-$2')
                    e.target.value = value
                }
            })
        }
        
        const data = document.getElementById('dataNascimentoCriar')
        if (data) {
            data.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '')
                if (value.length <= 8) {
                    if (value.length >= 5) {
                        value = value.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3')
                    } else if (value.length >= 3) {
                        value = value.replace(/(\d{2})(\d{0,2})/, '$1/$2')
                    }
                    e.target.value = value
                }
            })
        }
    }
    vincularListenersEditar() {
        const ids = ['nomeEdit','emailEdit','tipoUsuarioEdit','statusEdit','cpfEdit','dataNascimentoEdit','telefoneEdit','cepEdit','enderecoEdit','senhaEdit']
        ids.forEach(id => {
            const el = document.getElementById(id)
            if (!el) return
            el.addEventListener('input', () => {
                el.classList.remove('is-invalid')
                const fb = el.parentElement && el.parentElement.querySelector('.invalid-feedback')
                if (fb) fb.remove()
            })
        })
        
        const cpf = document.getElementById('cpfEdit')
        if (cpf) {
            cpf.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '')
                if (value.length <= 11) {
                    value = value.replace(/(\d{3})(\d)/, '$1.$2')
                    value = value.replace(/(\d{3})(\d)/, '$1.$2')
                    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                    e.target.value = value
                }
            })
        }
        
        const tel = document.getElementById('telefoneEdit')
        if (tel) {
            tel.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '')
                if (value.length <= 11) {
                    if (value.length > 10) {
                        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                    } else if (value.length > 6) {
                        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
                    } else if (value.length > 2) {
                        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2')
                    } else {
                        value = value.replace(/(\d*)/, '($1')
                    }
                    e.target.value = value
                }
            })
        }
        
        const cep = document.getElementById('cepEdit')
        if (cep) {
            cep.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '')
                if (value.length <= 8) {
                    value = value.replace(/(\d{5})(\d)/, '$1-$2')
                    e.target.value = value
                }
            })
        }
        
        const data = document.getElementById('dataNascimentoEdit')
        if (data) {
            data.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '')
                if (value.length <= 8) {
                    if (value.length >= 5) {
                        value = value.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3')
                    } else if (value.length >= 3) {
                        value = value.replace(/(\d{2})(\d{0,2})/, '$1/$2')
                    }
                    e.target.value = value
                }
            })
        }
    }
}
window.ModalUsuario = ModalUsuario
