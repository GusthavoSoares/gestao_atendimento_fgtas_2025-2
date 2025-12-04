class Inicializador {
    static inicializar(options = {}) {
        const { requerAdmin = false, callback = null } = options
        document.addEventListener('DOMContentLoaded', () => {
            try {
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
            } catch (error) {
                console.error('Erro ao inicializar aplicação:', error)
            }
        })
    }
    static carregarSidebar() {
        const container = document.getElementById('sidebar-container')
        if (container) {
            const sidebarHTML = SidebarNavegacao.gerar()
            if (sidebarHTML) {
                container.innerHTML = sidebarHTML
                SidebarNavegacao.marcarAtivo()
            } else {
                console.error('Inicializador: Falha ao gerar HTML do sidebar')
            }
        } else {
            console.error('Inicializador: Container do sidebar não encontrado')
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
