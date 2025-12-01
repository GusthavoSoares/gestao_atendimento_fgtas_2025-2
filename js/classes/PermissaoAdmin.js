class PermissaoAdmin {
    static verificarPermissao(redirecionar = true) {
        const usuario = Auth.obterUsuario()
        if (!usuario) {
            if (redirecionar) {
                window.location.href = '../index.html'
            }
            return false
        }
        if (usuario.tipo_usuario !== 'Administrador' && usuario.tipo_usuario !== 'Admin') {
            if (redirecionar) {
                window.location.href = 'erro.html?tipo=acesso-negado'
            }
            return false
        }
        return true
    }

    static ehAdmin() {
        return this.verificarPermissao(false)
    }
}
