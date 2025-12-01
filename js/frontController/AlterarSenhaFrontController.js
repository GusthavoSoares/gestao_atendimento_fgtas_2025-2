class AlterarSenhaFrontController {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8001'
        this.formulario = document.getElementById('formAlterarSenha')
        this.validation = new ValidationService()
        AuthMiddleware.validarAutenticacao('../index.html')
        this.inicializarEventos()
        this.carregarDadosUsuario()
    }
    carregarDadosUsuario() {
        const usuario = AuthMiddleware.obterUsuario()
        if (usuario) {
            document.getElementById('nomeUsuario').textContent = usuario.nome
            document.getElementById('emailUsuario').textContent = usuario.email
        }
    }
    inicializarEventos() {
        this.formulario.addEventListener('submit', (e) => this.handleSubmit(e))
    }
    async handleSubmit(e) {
        e.preventDefault()
        const senhaAtual = document.getElementById('senhaAtual').value
        const novaSenha = document.getElementById('novaSenha').value
        const confirmarSenha = document.getElementById('confirmarSenha').value
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            UIMiddleware.mostrarMensagem('Todos os campos são obrigatórios', 'danger', null, 0)
            return
        }
        if (novaSenha !== confirmarSenha) {
            UIMiddleware.mostrarMensagem('As senhas não conferem', 'danger', null, 0)
            return
        }
        if (senhaAtual === novaSenha) {
            UIMiddleware.mostrarMensagem('A nova senha deve ser diferente da senha atual', 'danger', null, 0)
            return
        }
        const regexSenha = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
        if (!regexSenha.test(novaSenha)) {
            UIMiddleware.mostrarMensagem('A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 número e 1 caractere especial', 'danger', null, 0)
            return
        }
        try {
            UIMiddleware.limparMensagens()
            const btnSubmit = this.formulario.querySelector('button[type="submit"]')
            UIMiddleware.mostrarCarregamento(btnSubmit, true, 'Processando...', '<i class="fas fa-save"></i> Alterar Senha')
            const usuario = AuthMiddleware.obterUsuario()
            const token = AuthMiddleware.obterToken()
            const resposta = await fetch(`${this.API_BASE_URL}/usuarios/${usuario.id}/alterar-senha`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    senhaAtual: senhaAtual,
                    novaSenha: novaSenha
                })
            })
            const dados = await resposta.json()
            if (!resposta.ok) {
                throw new Error(dados.erro || 'Erro ao alterar senha')
            }
            UIMiddleware.mostrarMensagem('Senha alterada com sucesso!', 'success', null, 2000)
            this.formulario.reset()
            setTimeout(() => {
                window.history.back()
            }, 2000)
        } catch (erro) {
            UIMiddleware.mostrarMensagem(erro.message, 'danger', null, 0)
        } finally {
            const btnSubmit = this.formulario.querySelector('button[type="submit"]')
            UIMiddleware.mostrarCarregamento(btnSubmit, false)
        }
    }
    fazerLogout() {
        if (confirm('Tem certeza que deseja fazer logout?')) {
            AuthMiddleware.logout('../index.html')
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const instance = new AlterarSenhaFrontController()
    window.alterarSenhaFrontController = instance
    window.AlterarSenhaController = instance
    window.alterarSenha = instance
})
