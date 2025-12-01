class Auth {
    static estaAutenticado() {
        return !!localStorage.getItem('token')
    }
    static obterUsuario() {
        return JSON.parse(localStorage.getItem('usuario') || 'null')
    }
    static fazerLogout() {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
    }
}
