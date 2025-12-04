class UsuarioFrontController {
    constructor(modo = 'listar', usuarioId = null) {
        try {
            this.API_BASE_URL = 'http://localhost:8001'
            this.usuarios = []
            this.tiposUsuarios = []
            this.filtroStatus = 'todos'
            this.filtroTipo = 'todos'
            this.http = new HttpService(this.API_BASE_URL)
            this.notification = new NotificationService()
            this.dateService = new DateService()
            this.validation = new ValidationService()
            this.modal = new window.ModalUsuario(this.API_BASE_URL, this.http, this.dateService)
            this.render = new UsuarioRender(this.dateService)
            this.filtroRender = new FiltroRender()
            if (!PermissaoAdmin.verificarPermissao()) return
            this.inicializarListagem()
        } catch (error) {
            console.error('Erro ao inicializar UsuarioFrontController:', error)
        }
    }
    async inicializarListagem() {
        await Promise.all([
            this.carregarUsuarios(),
            this.carregarTiposUsuarios()
        ])
        BotoesFiltroRender.renderizarBotoes('botoesFiltroContainer')
        this.configurarEventos()
        this.popularFiltroTipos()
        await this.modal.carregarTiposUsuarios()

        // Configurar botão Novo Usuário
        const btnNovoUsuario = document.getElementById('btnNovoUsuario')
        if (btnNovoUsuario) {
            btnNovoUsuario.addEventListener('click', () => {
                this.modal.abrirCriar(() => this.inicializarListagem())
            })
        }
    }
    async carregarUsuarios() {
        try {
            this.usuarios = await this.http.get('/usuarios')
            this.filtroRender.renderizarSelectStatus('filtroStatus', this.usuarios.map(u => u.status))
            this.renderizarTabela()
        } catch (erro) {
            this.notification.mostrarErro(erro)
        }
    }
    async carregarTiposUsuarios() {
        try {
            this.tiposUsuarios = await this.http.get('/tiposUsuarios')
        } catch (erro) {
            console.error(erro)
        }
    }
    configurarEventos() {
        const filtroStatus = document.getElementById('filtroStatus')
        const filtroTipo = document.getElementById('filtroTipo')

        const renderDebounced = (typeof debounce === 'function')
            ? debounce(() => this.renderizarTabela(), 120)
            : () => this.renderizarTabela()

        if (filtroStatus) filtroStatus.addEventListener('change', (e) => {
            this.filtroStatus = e.target.value
            renderDebounced()
        })
        if (filtroTipo) filtroTipo.addEventListener('change', (e) => {
            this.filtroTipo = e.target.value
            renderDebounced()
        })

        BotoesFiltroRender.configurarEventos(
            () => this.limparFiltros(),
            async () => await this.recarregarDados()
        )
    }

    limparFiltros() {
        this.filtroStatus = 'todos'
        this.filtroTipo = 'todos'
        const filtroStatus = document.getElementById('filtroStatus')
        const filtroTipo = document.getElementById('filtroTipo')
        if (filtroStatus) filtroStatus.value = 'todos'
        if (filtroTipo) filtroTipo.value = 'todos'
        this.renderizarTabela()
    }

    async recarregarDados() {
        await this.carregarUsuarios()
        this.notification.mostrarSucesso('Dados recarregados com sucesso!')
    }
    popularFiltroTipos() {
        const sel = document.getElementById('filtroTipo')
        if (!sel) return
        this.tiposUsuarios.forEach(t => {
            const opt = document.createElement('option')
            opt.value = t.tipo
            opt.textContent = t.tipo
            sel.appendChild(opt)
        })
    }
    renderizarTabela() {
        let usuarios = [...this.usuarios]
        if (this.filtroStatus !== 'todos') {
            usuarios = usuarios.filter(u => {
                const status = (u.status || '').trim()
                return status.toLowerCase() === this.filtroStatus.toLowerCase()
            })
        }
        if (this.filtroTipo !== 'todos') {
            usuarios = usuarios.filter(u => u.tipo_usuario === this.filtroTipo)
        }
        const ordenados = usuarios.sort((a, b) => a.id - b.id)
        this.render.renderizarTabela(
            ordenados,
            (id) => this.abrirModalEditar(id),
            (id, status) => this.toggleStatus(id, status),
            (id) => this.deletarPermanente(id)
        )
    }
    async deletarPermanente(id) {
        if (!PermissaoAdmin.verificarPermissao(false)) {
            this.notification.mostrarErro('Apenas administradores podem excluir usuários permanentemente!')
            return
        }
        if (!confirm('Tem certeza que deseja excluir este usuário permanentemente? Esta ação não pode ser desfeita.')) return
        try {
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/usuarios/${id}/deletar`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!resposta.ok) throw new Error('Erro ao excluir usuário')
            this.notification.mostrarSucesso('Usuário excluído com sucesso!')
            await this.carregarUsuarios()
        } catch (erro) {
            this.notification.mostrarErro(erro.message)
        }
    }
    async toggleStatus(id, statusAtual) {
        const novoStatus = statusAtual === 'Ativo' ? 'Inativo' : 'Ativo'
        const acao = novoStatus === 'Inativo' ? 'desativar' : 'ativar'
        if (!confirm(`Tem certeza que deseja ${acao} este usuário?`)) return
        try {
            await this.http.put(`/usuarios/${id}`, { status: novoStatus })
            this.notification.mostrarSucesso(`Usuário ${acao === 'desativar' ? 'desativado' : 'ativado'} com sucesso!`)
            this.carregarUsuarios()
        } catch (erro) {
            this.notification.mostrarErro(erro)
        }
    }
    async inicializarCriar() {
        this.formulario = document.getElementById('formCriarUsuario')
        await this.carregarTiposUsuarios()
        this.popularSelectTipos()
        this.configurarEventosCriar()
        this.aplicarMascaras()
    }
    configurarEventosCriar() {
        this.formulario.addEventListener('submit', (e) => this.handleSubmitCriar(e))
    }
    async handleSubmitCriar(e) {
        e.preventDefault()
        const senhaEl = document.getElementById('senhaCriar')
        const senha = senhaEl ? senhaEl.value : ''
        const confirmarEl = document.getElementById('confirmar_senha') || document.getElementById('senhaConfirmarCriar')
        const confirmarSenha = confirmarEl ? confirmarEl.value : null
        if (confirmarSenha !== null && senha !== confirmarSenha) {
            UIMiddleware.mostrarMensagem('As senhas não coincidem!', 'danger', null, 0)
            return
        }
        const dados = {
            nome: document.getElementById('nomeCriar')?.value,
            email: document.getElementById('emailCriar')?.value,
            id_tipo_usuario: (document.getElementById('tipoUsuarioCriar')?.value || '') || null,
            status: document.getElementById('statusCriar')?.value,
            cpf: document.getElementById('cpfCriar')?.value || null,
            data_nascimento: document.getElementById('dataNascimentoCriar')?.value || null,
            telefone: document.getElementById('telefoneCriar')?.value || null,
            cep: document.getElementById('cepCriar')?.value || null,
            endereco: document.getElementById('enderecoCriar')?.value,
            senha: senha
        }
        if (dados.cpf) dados.cpf = dados.cpf.replace(/\D/g, '')
        if (dados.telefone) dados.telefone = dados.telefone.replace(/\D/g, '')
        if (dados.cep) dados.cep = dados.cep.replace(/\D/g, '')
        if (dados.id_tipo_usuario === '') dados.id_tipo_usuario = null
        try {
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dados)
            })
            if (!resposta.ok) {
                const erro = await resposta.json()
                throw new Error(erro.erro || 'Erro ao criar usuário')
            }
            UIMiddleware.mostrarMensagem('Usuário criado com sucesso!', 'success', null, 0)
            setTimeout(() => {
                window.location.href = 'usuarios.html'
            }, 1500)
        } catch (erro) {
            UIMiddleware.mostrarMensagem(erro.message, 'danger', null, 0)
        }
    }
    async inicializarEditar() {
        this.formulario = document.getElementById('formEditarUsuario')
        await Promise.all([
            this.carregarTiposUsuarios(),
            this.carregarUsuario()
        ])
        this.popularSelectTipos()
        this.configurarEventosEditar()
        this.aplicarMascaras()
    }
    async carregarUsuario() {
        try {
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/usuarios/${this.usuarioId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!resposta.ok) throw new Error('Erro ao carregar usuário')
            const usuario = await resposta.json()
            this.preencherFormulario(usuario)
        } catch (erro) {
            UIMiddleware.mostrarMensagem(erro.message, 'danger', null, 0)
        }
    }
    preencherFormulario(usuario) {
        document.getElementById('usuarioIdEdit').value = usuario.id
        document.getElementById('nomeEdit').value = usuario.nome || ''
        document.getElementById('emailEdit').value = usuario.email || ''
        document.getElementById('tipoUsuarioEdit').value = usuario.id_tipo_usuario || ''
        document.getElementById('statusEdit').value = usuario.status || 'Ativo'
        document.getElementById('cpfEdit').value = this.validation.formatarCPF(usuario.cpf || '')
        document.getElementById('dataNascimentoEdit').value = this.dateService.formatarDataParaInput(usuario.data_nascimento)
        document.getElementById('telefoneEdit').value = this.validation.formatarTelefone(usuario.telefone || '')
        document.getElementById('cepEdit').value = this.validation.formatarCEP(usuario.cep || '')
        document.getElementById('enderecoEdit').value = usuario.endereco || ''
    }
    configurarEventosEditar() {
        this.formulario.addEventListener('submit', (e) => this.handleSubmitEditar(e))
    }
    async handleSubmitEditar(e) {
        e.preventDefault()
        const senhaEl = document.getElementById('senhaEdit')
        const senha = senhaEl ? senhaEl.value : ''
        const confirmarEl = document.getElementById('confirmar_senha') || document.getElementById('senhaConfirmarEdit')
        const confirmarSenha = confirmarEl ? confirmarEl.value : null
        if (senha && confirmarSenha !== null && senha !== confirmarSenha) {
            UIMiddleware.mostrarMensagem('As senhas não coincidem!', 'danger', null, 0)
            return
        }
        const dados = {
            nome: document.getElementById('nomeEdit')?.value,
            email: document.getElementById('emailEdit')?.value,
            id_tipo_usuario: (document.getElementById('tipoUsuarioEdit')?.value || '') || null,
            status: document.getElementById('statusEdit')?.value,
            cpf: document.getElementById('cpfEdit')?.value || null,
            data_nascimento: document.getElementById('dataNascimentoEdit')?.value || null,
            telefone: document.getElementById('telefoneEdit')?.value || null,
            cep: document.getElementById('cepEdit')?.value || null,
            endereco: document.getElementById('enderecoEdit')?.value
        }
        if (senha) {
            dados.senha = senha
        }
        if (dados.cpf) dados.cpf = dados.cpf.replace(/\D/g, '')
        if (dados.telefone) dados.telefone = dados.telefone.replace(/\D/g, '')
        if (dados.cep) dados.cep = dados.cep.replace(/\D/g, '')
        if (dados.id_tipo_usuario === '') dados.id_tipo_usuario = null
        try {
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/usuarios/${this.usuarioId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dados)
            })
            if (!resposta.ok) {
                const erro = await resposta.json()
                throw new Error(erro.erro || 'Erro ao atualizar usuário')
            }
            UIMiddleware.mostrarMensagem('Usuário atualizado com sucesso!', 'success', null, 0)
            setTimeout(() => {
                window.location.href = 'usuarios.html'
            }, 1500)
        } catch (erro) {
            UIMiddleware.mostrarMensagem(erro.message, 'danger', null, 0)
        }
    }
    popularSelectTipos() {
        const select = document.getElementById('tipo_usuario')
        if (!select) return
        select.innerHTML = '<option value="">Selecione...</option>'
        this.tiposUsuarios.forEach(tipo => {
            const option = document.createElement('option')
            option.value = tipo.id
            option.textContent = tipo.tipo
            select.appendChild(option)
        })
    }
    aplicarMascaras() {
        const cpfInput = document.getElementById('cpf')
        const telefoneInput = document.getElementById('telefone')
        const cepInput = document.getElementById('cep')
        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '')
                if (value.length > 11) value = value.slice(0, 11)
                value = value.replace(/(\d{3})(\d)/, '$1.$2')
                value = value.replace(/(\d{3})(\d)/, '$1.$2')
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                e.target.value = value
            })
        }
        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '')
                if (value.length > 11) value = value.slice(0, 11)
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2')
                value = value.replace(/(\d)(\d{4})$/, '$1-$2')
                e.target.value = value
            })
        }
        if (cepInput) {
            cepInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '')
                if (value.length > 8) value = value.slice(0, 8)
                value = value.replace(/(\d{5})(\d)/, '$1-$2')
                e.target.value = value
            })
        }
    }
    async criarUsuario() {
        this.modal.criar(() => {
            this.carregarUsuarios()
        })
    }
    async abrirModalEditar(id) {
        this.modal.abrirEditar(id)
    }
    async salvarEdicao() {
        this.modal.salvarEdicao(() => {
            this.carregarUsuarios()
        })
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const instance = new UsuarioFrontController()
        window.usuarioFrontController = instance
    })
} else {
    const instance = new UsuarioFrontController()
    window.usuarioFrontController = instance
}
