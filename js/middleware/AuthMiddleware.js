class AuthMiddleware {
    static estaAutenticado() {
        const token = localStorage.getItem('token')
        const usuario = localStorage.getItem('usuario')
        return !!(token && usuario)
    }
    static obterUsuario() {
        const usuarioStr = localStorage.getItem('usuario')
        if (!usuarioStr) return null
        try {
            return JSON.parse(usuarioStr)
        } catch (error) {
            console.error('Erro ao parsear dados do usuário:', error)
            return null
        }
    }
    static obterToken() {
        return localStorage.getItem('token')
    }
    static validarAutenticacao(urlRedirect = '/index.html') {
        if (!this.estaAutenticado()) {
            window.location.href = urlRedirect
            return null
        }
        return this.obterUsuario()
    }
    static temPermissao(tiposPermitidos) {
        const usuario = this.obterUsuario()
        if (!usuario || !usuario.id_tipo) return false
        if (Array.isArray(tiposPermitidos)) {
            return tiposPermitidos.includes(usuario.id_tipo)
        }
        return usuario.id_tipo === tiposPermitidos
    }
    static validarPermissao(tiposPermitidos, urlRedirect = '/pages/acesso-negado.html') {
        if (!this.temPermissao(tiposPermitidos)) {
            window.location.href = urlRedirect
            return false
        }
        return true
    }
    static logout(urlRedirect = '/index.html') {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        window.location.href = urlRedirect
    }
    static salvarAutenticacao(token, usuario) {
        localStorage.setItem('token', token)
        localStorage.setItem('usuario', JSON.stringify(usuario))
    }
    static tokenExpirado() {
        const usuario = this.obterUsuario()
        if (!usuario || !usuario.exp) return false
        const agora = Math.floor(Date.now() / 1000)
        return usuario.exp < agora
    }
    static protegerPagina() {
        if (!this.estaAutenticado() || this.tokenExpirado()) {
            if (this.tokenExpirado()) {
                UIMiddleware.mostrarMensagem('Sessão expirada. Faça login novamente.', 'warning')
            }
            setTimeout(() => {
                window.location.href = '/index.html'
            }, 1000)
        }
    }
}
window.AuthMiddleware = AuthMiddleware
