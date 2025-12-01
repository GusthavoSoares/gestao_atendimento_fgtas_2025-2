class EsqueciSenhaFrontController {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8001'
        this.formulario = document.getElementById('formEsqueciSenha')
        this.cpfInput = document.getElementById('cpf')
        this.validation = new ValidationService()
        this.inicializarEventos()
        this.aplicarMascaraCPF()
    }
    inicializarEventos() {
        this.formulario.addEventListener('submit', (e) => this.handleSubmit(e))
    }
    aplicarMascaraCPF() {
        this.cpfInput.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '')
            if (valor.length <= 11) {
                valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
                valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
                valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            }
            e.target.value = valor
        })
    }
    async handleSubmit(e) {
        e.preventDefault()
        const email = document.getElementById('email').value.trim()
        const cpf = document.getElementById('cpf').value.replace(/\D/g, '')
        const novaSenha = document.getElementById('novaSenha').value.trim()
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim()
        if (!email || !cpf || !novaSenha || !confirmarSenha) {
            UIMiddleware.mostrarMensagem('Todos os campos são obrigatórios', 'danger', null, 0)
            return
        }
        if (!this.validation.validarEmail(email)) {
            UIMiddleware.mostrarMensagem('Email inválido', 'danger', null, 0)
            return
        }
        if (cpf.length !== 11) {
            UIMiddleware.mostrarMensagem('CPF deve ter 11 dígitos', 'danger', null, 0)
            return
        }
        if (novaSenha !== confirmarSenha) {
            UIMiddleware.mostrarMensagem('As senhas não conferem', 'danger', null, 0)
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
            UIMiddleware.mostrarCarregamento(btnSubmit, true, 'Processando...', '<i class="fas fa-key"></i> Redefinir Senha')
            const resposta = await fetch(`${this.API_BASE_URL}/usuarios/esqueci-senha`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    cpf: cpf,
                    novaSenha: novaSenha
                })
            })
            const dados = await resposta.json()
            
            UIMiddleware.mostrarCarregamento(btnSubmit, false)
            
            if (!resposta.ok) {
                throw new Error(dados.erro || 'Erro ao redefinir senha')
            }
            this.formulario.reset()
            UIMiddleware.mostrarMensagem('Senha redefinida com sucesso! Redirecionando...', 'success', null, 2000)
            setTimeout(() => {
                window.location.href = '../index.html'
            }, 2000)
        } catch (erro) {
            UIMiddleware.mostrarMensagem(erro.message, 'danger', null, 0)
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const instance = new EsqueciSenhaFrontController()
    window.esqueciSenhaFrontController = instance
    window.EsqueciSenhaController = instance
    window.esqueciSenhaController = instance
})
