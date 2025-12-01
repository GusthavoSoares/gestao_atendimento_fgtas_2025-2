class LoginFrontController {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8001'
        this.formulario = document.getElementById('formLogin')
        this.emailInput = document.getElementById('email')
        this.senhaInput = document.getElementById('senha')
        this.validation = new ValidationService()
        this.inicializarEventos()
    }
    inicializarEventos() {
        this.formulario.addEventListener('submit', (e) => this.handleSubmit(e))
        this.senhaInput.addEventListener('keypress', (e) => this.handleKeypress(e))
    }
    async handleSubmit(e) {
        e.preventDefault()
        const email = this.emailInput.value.trim()
        const senha = this.senhaInput.value.trim()
        if (!email || !senha) {
            UIMiddleware.mostrarMensagem('Email e senha são obrigatórios', 'danger', null, 0)
            return
        }
        if (!this.validation.validarEmail(email)) {
            UIMiddleware.mostrarMensagem('Email inválido', 'danger', null, 0)
            return
        }
        try {
            UIMiddleware.limparMensagens()
            const btnSubmit = this.formulario.querySelector('button[type="submit"]')
            UIMiddleware.mostrarCarregamento(btnSubmit, true, 'Carregando...', '<i class="fas fa-sign-in-alt"></i> Entrar')
            const resposta = await fetch(`${this.API_BASE_URL}/usuarios/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            })
            const dados = await resposta.json()
            if (!resposta.ok) {
                throw new Error(dados.erro || 'Erro ao fazer login')
            }
            if (dados.usuario && dados.usuario.status) {
                const status = dados.usuario.status.trim().toLowerCase()
                if (status !== 'ativo') {
                    throw new Error('Usuário inativo. Entre em contato com o administrador.')
                }
            }
            AuthMiddleware.salvarAutenticacao(dados.token, dados.usuario)
            window.location.href = 'pages/dashboard.html'
        } catch (erro) {
            UIMiddleware.mostrarMensagem(erro.message, 'danger', null, 0)
        } finally {
            const btnSubmit = this.formulario.querySelector('button[type="submit"]')
            UIMiddleware.mostrarCarregamento(btnSubmit, false)
        }
    }
    handleKeypress(e) {
        if (e.key === 'Enter') {
            this.formulario.dispatchEvent(new Event('submit'))
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const instance = new LoginFrontController()
    window.loginFrontController = instance
    window.LoginController = instance
    window.loginIndex = instance
})
