class ModalUsuario {
    constructor(apiBaseUrl, httpService, dateService) {
        this.API_BASE_URL = apiBaseUrl
        this.http = httpService
        this.dateService = dateService
        this.validation = new ValidationService()
        this.tiposUsuarios = []
        this._modalCriar = null
        this._modalEditar = null
        this.currentCallback = { onSuccess: null, onError: null }
        this.render = new UsuarioRender(this.dateService)
        this.modalService = new ModalService()
        this._submitting = false
    }

    async ensureTemplates() {
        // Verifica se os modais já existem, se não, cria ambos
        const modalCriar = document.getElementById('modalCriarUsuario')
        const modalEditar = document.getElementById('modalEditarUsuario')

        if (!modalCriar || !modalEditar) {
            this.modalService.ensureElement('modalCriarUsuario', () => this.render.getModalTemplates())
        }
    }

    async carregarTiposUsuarios() {
        try {
            this.tiposUsuarios = await this.http.get('/tiposUsuarios')
        } catch (erro) {
            console.error('Erro ao carregar tipos de usuários:', erro)
            this.tiposUsuarios = []
        }
    }

    async verificarEmailDuplicado(email, idExcluir = null) {
        try {
            const usuarios = await this.http.get('/usuarios')
            return usuarios.some(u =>
                u.email.toLowerCase() === email.toLowerCase() &&
                (!idExcluir || u.id !== parseInt(idExcluir))
            )
        } catch (erro) {
            console.error('Erro ao verificar email:', erro)
            return false
        }
    }

    async verificarCPFDuplicado(cpf, idExcluir = null) {
        try {
            const cpfLimpo = cpf.replace(/\D/g, '')
            if (!cpfLimpo) return false

            const usuarios = await this.http.get('/usuarios')
            return usuarios.some(u =>
                u.cpf && u.cpf.replace(/\D/g, '') === cpfLimpo &&
                (!idExcluir || u.id !== parseInt(idExcluir))
            )
        } catch (erro) {
            console.error('Erro ao verificar CPF:', erro)
            return false
        }
    }

    async preencherSelectTipos(selectId) {
        if (!this.tiposUsuarios || !this.tiposUsuarios.length) await this.carregarTiposUsuarios()
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

    async abrirCriar(onSuccess) {
        this.currentCallback = ModalService.normalizeCallbacks(onSuccess)
        await this.ensureTemplates()
        await this.preencherSelectTipos('tipoUsuarioCriar')

        this._modalCriar = this.modalService.createBootstrapModal('modalCriarUsuario')
        if (!this._modalCriar) {
            console.error('Erro: Não foi possível criar o modal de usuário.')
            return
        }

        const btn = document.getElementById('btnCriarUsuario')
        if (btn) {
            const newBtn = btn.cloneNode(true)
            btn.parentNode.replaceChild(newBtn, btn)
            newBtn.addEventListener('click', () => this.criar(onSuccess))
        }

        const cancelarBtn = this._modalCriar._element?.querySelector('[data-bs-dismiss="modal"]')
        if (cancelarBtn) {
            cancelarBtn.addEventListener('click', () => {
                this._modalCriar.hide()
                this.limparFormCriar()
            })
        }

        this._modalCriar.show()
    } async abrirEditar(id, onSuccess) {
        try {
            this.currentCallback = ModalService.normalizeCallbacks(onSuccess)
            await this.ensureTemplates()

            // Aguardar o DOM ser processado após a injeção e verificar se o elemento existe
            await new Promise(resolve => setTimeout(resolve, 150))

            // Verificar se o elemento modal realmente existe
            const modalElement = document.getElementById('modalEditarUsuario')
            if (!modalElement) {
                console.error('Elemento modalEditarUsuario não encontrado no DOM')
                return
            }

            // Limpar qualquer backdrop órfão
            const backdrops = document.querySelectorAll('.modal-backdrop')
            backdrops.forEach(backdrop => backdrop.remove())

            // Remover classe modal-open do body
            document.body.classList.remove('modal-open')
            document.body.style.overflow = ''
            document.body.style.paddingRight = ''

            // Ocultar modal anterior se existir
            if (this._modalEditar) {
                try {
                    this._modalEditar.hide()
                } catch (e) {
                    console.log('Modal anterior já estava oculto')
                }
                this._modalEditar = null
            }

            this._modalEditar = this.modalService.createBootstrapModal('modalEditarUsuario')
            if (!this._modalEditar) {
                console.error('Erro: Não foi possível criar o modal de edição')
                return
            }

            await this.preencherSelectTipos('tipoUsuarioEdit')
            const usuario = await this.http.get(`/usuarios/${id}`)
            const setIf = (sel, val) => { const el = document.getElementById(sel); if (el) el.value = val }
            setIf('usuarioIdEdit', usuario.id)
            setIf('nomeEdit', usuario.nome)
            setIf('emailEdit', usuario.email)
            setIf('tipoUsuarioEdit', usuario.id_tipo_usuario)
            setIf('statusEdit', usuario.status)
            setIf('cpfEdit', usuario.cpf || '')
            setIf('dataNascimentoEdit', this.dateService.formatarDataBRParaInput(usuario.data_nascimento))
            setIf('telefoneEdit', usuario.telefone || '')
            setIf('cepEdit', usuario.cep || '')
            setIf('enderecoEdit', usuario.endereco || '')
            this.limparErrosEditar()
            this.vincularListenersEditar()
            this._modalEditar.show()
        } catch (erro) {
            const callbacks = ModalService.mergeCallbacks(onSuccess, this.currentCallback)
            if (callbacks.onError) callbacks.onError(erro.message || 'Erro ao carregar usuário.')
        }
    }

    async criar(onSuccess) {
        // Prevenir múltiplas submissões
        if (this._submitting) {
            return
        }

        const callbacks = ModalService.mergeCallbacks(onSuccess, this.currentCallback)

        const getVal = (id) => {
            const el = document.getElementById(id)
            return el ? el.value : ''
        }

        const dados = {
            nome: getVal('nomeCriar'),
            email: getVal('emailCriar'),
            id_tipo_usuario: getVal('tipoUsuarioCriar') || null,
            status: 'Ativo',
            cpf: getVal('cpfCriar') || null,
            data_nascimento: this.dateService.parseDataBRParaISO(getVal('dataNascimentoCriar')) || null,
            telefone: getVal('telefoneCriar') || null,
            cep: getVal('cepCriar') || null,
            endereco: getVal('enderecoCriar'),
            senha: getVal('senhaCriar')
        }
        // Limpar formatação e converter strings vazias em null
        if (dados.cpf) {
            dados.cpf = dados.cpf.replace(/\D/g, '')
            if (!dados.cpf) dados.cpf = null
        }
        if (dados.telefone) {
            dados.telefone = dados.telefone.replace(/\D/g, '')
            if (!dados.telefone) dados.telefone = null
        }
        if (dados.cep) {
            dados.cep = dados.cep.replace(/\D/g, '')
            if (!dados.cep) dados.cep = null
        }
        this.limparErrosCriar()
        this.limparMensagemCriar()
        let invalido = false
        if (!dados.nome || dados.nome.trim().length < 3) { this.mostrarErroCampo('nomeCriar', 'Nome é obrigatório (mín. 3 caracteres).'); invalido = true }
        if (!dados.email || !this.validation.validarEmail(dados.email)) { this.mostrarErroCampo('emailCriar', 'Email é obrigatório e deve ser válido.'); invalido = true }
        if (!dados.id_tipo_usuario) { this.mostrarErroCampo('tipoUsuarioCriar', 'Tipo de usuário é obrigatório.'); invalido = true }
        if (!dados.status) { this.mostrarErroCampo('statusCriar', 'Status é obrigatório.'); invalido = true }
        if (!dados.endereco || dados.endereco.trim().length < 3) { this.mostrarErroCampo('enderecoCriar', 'Endereço é obrigatório.'); invalido = true }
        if (dados.cpf && !this.validation.validarCPF(dados.cpf)) { this.mostrarErroCampo('cpfCriar', 'CPF inválido.'); invalido = true }
        if (dados.telefone && !this.validation.validarTelefone(dados.telefone)) { this.mostrarErroCampo('telefoneCriar', 'Telefone inválido.'); invalido = true }
        if (dados.cep && !this.validation.validarCEP(dados.cep)) { this.mostrarErroCampo('cepCriar', 'CEP inválido.'); invalido = true }
        if (!dados.senha || dados.senha.length < 6) { this.mostrarErroCampo('senhaCriar', 'Senha é obrigatória (mín. 6 caracteres).'); invalido = true }
        if (invalido) {
            this.modalService.showMessage('modalCriarUsuarioMensagem', 'Corrija os erros antes de salvar.', 'danger', 4000)
            return
        }

        // Verificar duplicação de email e CPF antes de enviar
        if (dados.email) {
            const emailDuplicado = await this.verificarEmailDuplicado(dados.email)
            if (emailDuplicado) {
                this.mostrarErroCampo('emailCriar', 'Este email já está cadastrado no sistema.')
                this.modalService.showMessage('modalCriarUsuarioMensagem', 'Este email já está cadastrado no sistema.', 'danger', 4000)
                return
            }
        }

        if (dados.cpf) {
            const cpfDuplicado = await this.verificarCPFDuplicado(dados.cpf)
            if (cpfDuplicado) {
                this.mostrarErroCampo('cpfCriar', 'Este CPF já está cadastrado no sistema.')
                this.modalService.showMessage('modalCriarUsuarioMensagem', 'Este CPF já está cadastrado no sistema.', 'danger', 4000)
                return
            }
        }

        try {
            this._submitting = true
            await this.http.post('/usuarios', dados)
            this.modalService.showMessage('modalCriarUsuarioMensagem', 'Usuário criado com sucesso!', 'success', 1500)
            setTimeout(() => {
                if (this._modalCriar) this._modalCriar.hide()
                this.limparFormCriar()
                this._submitting = false
                if (callbacks.onSuccess) callbacks.onSuccess()
                this.currentCallback = ModalService.normalizeCallbacks()
            }, 1500)
        } catch (erro) {
            this._submitting = false
            let mensagemErro = erro.message || 'Erro ao criar usuário.'

            // Tratar erros específicos de duplicação
            if (mensagemErro.includes('Duplicate entry') || mensagemErro.includes('ER_DUP_ENTRY') || mensagemErro.includes('já está cadastrado')) {
                if (mensagemErro.includes('email')) {
                    mensagemErro = 'Este email já está cadastrado no sistema.'
                    this.mostrarErroCampo('emailCriar', mensagemErro)
                } else if (mensagemErro.includes('cpf') || mensagemErro.includes('CPF')) {
                    mensagemErro = 'Este CPF já está cadastrado no sistema.'
                    this.mostrarErroCampo('cpfCriar', mensagemErro)
                } else {
                    mensagemErro = 'Já existe um registro com estas informações.'
                }
            }

            this.modalService.showMessage('modalCriarUsuarioMensagem', mensagemErro, 'danger', 4000)
            if (callbacks.onError) callbacks.onError(mensagemErro)
        }
    }

    async salvarEdicao(onSuccess) {
        // Prevenir múltiplas submissões
        if (this._submitting) {
            return
        }

        const getVal = (id) => {
            const el = document.getElementById(id)
            return el ? el.value : ''
        }

        const id = getVal('usuarioIdEdit')
        const dados = {
            nome: getVal('nomeEdit'),
            email: getVal('emailEdit'),
            id_tipo_usuario: getVal('tipoUsuarioEdit') || null,
            status: getVal('statusEdit'),
            cpf: getVal('cpfEdit') || null,
            data_nascimento: this.dateService.parseDataBRParaISO(getVal('dataNascimentoEdit')) || null,
            telefone: getVal('telefoneEdit') || null,
            cep: getVal('cepEdit') || null,
            endereco: getVal('enderecoEdit')
        }
        // Limpar formatação e converter strings vazias em null
        if (dados.cpf) {
            dados.cpf = dados.cpf.replace(/\D/g, '')
            if (!dados.cpf) dados.cpf = null
        }
        if (dados.telefone) {
            dados.telefone = dados.telefone.replace(/\D/g, '')
            if (!dados.telefone) dados.telefone = null
        }
        if (dados.cep) {
            dados.cep = dados.cep.replace(/\D/g, '')
            if (!dados.cep) dados.cep = null
        }
        const senha = getVal('senhaEdit')
        if (senha) dados.senha = senha
        const usuarioLogado = JSON.parse(localStorage.getItem('usuario'))
        const estaInativandoProprioUsuario = usuarioLogado && usuarioLogado.id === parseInt(id) && dados.status.toLowerCase() === 'inativo'
        if (estaInativandoProprioUsuario) {
            if (!confirm('Você está inativando sua própria conta. Será deslogado automaticamente. Confirma?')) return
        }
        this.limparErrosEditar()
        this.limparMensagemEditar()
        let invalido = false
        if (!dados.nome || dados.nome.trim().length < 3) { this.mostrarErroCampo('nomeEdit', 'Nome é obrigatório (mín. 3 caracteres).'); invalido = true }
        if (!dados.email || !this.validation.validarEmail(dados.email)) { this.mostrarErroCampo('emailEdit', 'Email é obrigatório e deve ser válido.'); invalido = true }
        if (!dados.id_tipo_usuario) { this.mostrarErroCampo('tipoUsuarioEdit', 'Tipo de usuário é obrigatório.'); invalido = true }
        if (!dados.status) { this.mostrarErroCampo('statusEdit', 'Status é obrigatório.'); invalido = true }
        if (!dados.endereco || dados.endereco.trim().length < 3) { this.mostrarErroCampo('enderecoEdit', 'Endereço é obrigatório.'); invalido = true }
        if (dados.cpf && !this.validation.validarCPF(dados.cpf)) { this.mostrarErroCampo('cpfEdit', 'CPF inválido.'); invalido = true }
        if (dados.telefone && !this.validation.validarTelefone(dados.telefone)) { this.mostrarErroCampo('telefoneEdit', 'Telefone inválido.'); invalido = true }
        if (dados.cep && !this.validation.validarCEP(dados.cep)) { this.mostrarErroCampo('cepEdit', 'CEP inválido.'); invalido = true }
        if (senha && senha.length < 6) { this.mostrarErroCampo('senhaEdit', 'Senha deve ter ao menos 6 caracteres.'); invalido = true }
        if (invalido) {
            this.modalService.showMessage('modalEditarUsuarioMensagem', 'Corrija os erros antes de salvar.', 'danger', 4000)
            return
        }

        // Verificar duplicação de email e CPF antes de enviar (excluindo o próprio usuário)
        if (dados.email) {
            const emailDuplicado = await this.verificarEmailDuplicado(dados.email, id)
            if (emailDuplicado) {
                this.mostrarErroCampo('emailEdit', 'Este email já está cadastrado no sistema.')
                this.modalService.showMessage('modalEditarUsuarioMensagem', 'Este email já está cadastrado no sistema.', 'danger', 4000)
                return
            }
        }

        if (dados.cpf) {
            const cpfDuplicado = await this.verificarCPFDuplicado(dados.cpf, id)
            if (cpfDuplicado) {
                this.mostrarErroCampo('cpfEdit', 'Este CPF já está cadastrado no sistema.')
                this.modalService.showMessage('modalEditarUsuarioMensagem', 'Este CPF já está cadastrado no sistema.', 'danger', 4000)
                return
            }
        }

        try {
            this._submitting = true
            await this.http.put(`/usuarios/${id}`, dados)
            this.modalService.showMessage('modalEditarUsuarioMensagem', 'Usuário atualizado com sucesso!', 'success', 1500)
            setTimeout(() => {
                if (this._modalEditar) this._modalEditar.hide()
                const callback = onSuccess || this.currentCallback
                this._submitting = false
                if (typeof callback === 'function') callback()
                this.currentCallback = null
                if (estaInativandoProprioUsuario) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('usuario')
                    window.location.href = '../index.html'
                }
            }, 1500)
        } catch (erro) {
            this._submitting = false
            let mensagemErro = erro.message || 'Erro ao atualizar usuário.'

            // Tratar erros específicos de duplicação
            if (mensagemErro.includes('Duplicate entry') || mensagemErro.includes('ER_DUP_ENTRY')) {
                if (mensagemErro.includes('email')) {
                    mensagemErro = 'Este email já está cadastrado no sistema.'
                    this.mostrarErroCampo('emailEdit', mensagemErro)
                } else if (mensagemErro.includes('cpf')) {
                    mensagemErro = 'Este CPF já está cadastrado no sistema.'
                    this.mostrarErroCampo('cpfEdit', mensagemErro)
                } else {
                    mensagemErro = 'Já existe um registro com estas informações.'
                }
            }

            this.modalService.showMessage('modalEditarUsuarioMensagem', mensagemErro, 'danger', 4000)
        }
    }

    limparFormCriar() {
        const form = document.getElementById('formCriarUsuario')
        if (form) form.reset()
        this.limparMensagemCriar()
        this.limparErrosCriar()
    }

    limparMensagemCriar() { this.modalService.clearMessage('modalCriarUsuarioMensagem') }
    limparMensagemEditar() { this.modalService.clearMessage('modalEditarUsuarioMensagem') }

    limparErrosCriar() {
        const campos = ['nomeCriar', 'emailCriar', 'tipoUsuarioCriar', 'statusCriar', 'cpfCriar', 'dataNascimentoCriar', 'telefoneCriar', 'cepCriar', 'enderecoCriar', 'senhaCriar']
        campos.forEach(id => {
            const el = document.getElementById(id)
            if (!el) return
            el.classList.remove('is-invalid')
            if (!el.parentElement) return
            const feedback = el.parentElement.querySelector('.invalid-feedback')
            if (feedback) feedback.remove()
        })
    }

    limparErrosEditar() {
        const campos = ['nomeEdit', 'emailEdit', 'tipoUsuarioEdit', 'statusEdit', 'cpfEdit', 'dataNascimentoEdit', 'telefoneEdit', 'cepEdit', 'enderecoEdit', 'senhaEdit']
        campos.forEach(id => {
            const el = document.getElementById(id)
            if (!el) return
            el.classList.remove('is-invalid')
            if (!el.parentElement) return
            const feedback = el.parentElement.querySelector('.invalid-feedback')
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
        if (el.parentElement) el.parentElement.appendChild(feedback)
    }

    vincularListenersCriar() {
        const ids = ['nomeCriar', 'emailCriar', 'tipoUsuarioCriar', 'statusCriar', 'cpfCriar', 'dataNascimentoCriar', 'telefoneCriar', 'cepCriar', 'enderecoCriar', 'senhaCriar']
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

        const btnCriar = document.getElementById('btnCriarUsuario')
        if (btnCriar) btnCriar.addEventListener('click', () => this.criar())
    }

    vincularListenersEditar() {
        const ids = ['nomeEdit', 'emailEdit', 'tipoUsuarioEdit', 'statusEdit', 'cpfEdit', 'dataNascimentoEdit', 'telefoneEdit', 'cepEdit', 'enderecoEdit', 'senhaEdit']
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

        const btnSalvar = document.getElementById('btnSalvarUsuario')
        if (btnSalvar) btnSalvar.addEventListener('click', () => this.salvarEdicao())
    }
}

window.ModalUsuario = ModalUsuario
