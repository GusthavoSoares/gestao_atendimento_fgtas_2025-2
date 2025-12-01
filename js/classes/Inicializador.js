class Inicializador {
    static inicializar(options = {}) {
        const { requerAdmin = false, callback = null } = options
        document.addEventListener('DOMContentLoaded', () => {
            if (!Auth.estaAutenticado()) {
                window.location.href = this.obterCaminhoLogin()
                return
            }
            if (requerAdmin && !PermissaoAdmin.verificarPermissao()) {
                return
            }
            this.carregarSidebar()
            if (callback && typeof callback === 'function') {
                callback()
            }
        })
    }
    static carregarSidebar() {
        const container = document.getElementById('sidebar-container')
        if (container) {
            container.innerHTML = SidebarNavegacao.gerar()
            SidebarNavegacao.marcarAtivo()
        }
    }
    static obterCaminhoLogin() {
        const path = window.location.pathname
        if (path.includes('/pages/')) {
            return '../index.html'
        }
        return 'index.html'
    }
    static redirecionarParaLogin() {
        window.location.href = this.obterCaminhoLogin()
    }
}
