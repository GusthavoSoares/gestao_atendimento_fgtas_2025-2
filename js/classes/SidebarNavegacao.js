class SidebarNavegacao {
    static gerar() {
        const usuario = Auth.obterUsuario()
        const isAdmin = usuario && (usuario.tipo_usuario === 'Administrador' || usuario.tipo_usuario === 'Admin')
        const menuAdmin = isAdmin ? `
                    <div class="nav-section-title">
                        <i class="fas fa-tools"></i> Administração
                    </div>
                    <a href="usuarios.html" class="nav-item" title="Usuários">
                        <i class="fas fa-users"></i>
                        <span class="nav-text">Usuários</span>
                    </a>
                    <a href="portfolios.html" class="nav-item" title="Gerenciar Portfólios">
                        <i class="fas fa-briefcase"></i>
                        <span class="nav-text">Portfólios</span>
                    </a>
                    <a href="servicos.html" class="nav-item" title="Gerenciar Serviços">
                        <i class="fas fa-cogs"></i>
                        <span class="nav-text">Serviços</span>
                    </a>
                    <a href="solicitantes.html" class="nav-item" title="Gerenciar Solicitantes">
                        <i class="fas fa-user-friends"></i>
                        <span class="nav-text">Solicitantes</span>
                    </a>
                    <a href="tipos-solicitante.html" class="nav-item" title="Tipos de Solicitante">
                        <i class="fas fa-user-tag"></i>
                        <span class="nav-text">Tipo Solicitante</span>
                    </a>
                    <a href="tipos-usuario.html" class="nav-item" title="Tipos de Usuário">
                        <i class="fas fa-users-cog"></i>
                        <span class="nav-text">Tipo Usuário</span>
                    </a>
                    <a href="tipos-ocorrencia.html" class="nav-item" title="Tipos de Ocorrência">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span class="nav-text">Ocorrência</span>
                    </a>
        ` : ''
        return `
            <div class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <div class="logo-container">
                        <img src="../images/fgtas_logo.png" alt="FGTAS" class="logo-img">
                    </div>
                </div>
                <nav class="sidebar-nav">
                    <a href="dashboard.html" class="nav-item" title="Dashboard">
                        <i class="fas fa-chart-bar"></i>
                        <span class="nav-text">Dashboard</span>
                    </a>
                    <a href="atendimentos.html" class="nav-item" title="Atendimentos">
                        <i class="fas fa-phone"></i>
                        <span class="nav-text">Atendimentos</span>
                    </a>
                    <a href="relatorios.html" class="nav-item" title="Relatórios">
                        <i class="fas fa-chart-line"></i>
                        <span class="nav-text">Relatórios</span>
                    </a>
                    <a href="alterar-senha.html" class="nav-item" title="Alterar Senha">
                        <i class="fas fa-lock"></i>
                        <span class="nav-text">Alterar Senha</span>
                    </a>
                    ${menuAdmin}
                </nav>
                <div class="sidebar-footer">
                    <button onclick="DashboardUtils.fazerLogout()" class="btn btn-logout">
                        <i class="fas fa-sign-out-alt"></i>
                        <span class="nav-text">Logout</span>
                    </button>
                </div>
                <button class="toggle-sidebar" id="toggleSidebar" onclick="SidebarNavegacao.toggle()">
                    <i class="fas fa-chevron-left"></i>
                </button>
            </div>
            <div class="sidebar-overlay" id="sidebarOverlay" onclick="SidebarNavegacao.fechar()"></div>
        `
    }
    static toggle() {
        const sidebar = document.getElementById('sidebar')
        sidebar.classList.toggle('active')
        const overlay = document.getElementById('sidebarOverlay')
        overlay.classList.toggle('active')
    }
    static fechar() {
        const sidebar = document.getElementById('sidebar')
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active')
            const overlay = document.getElementById('sidebarOverlay')
            overlay.classList.remove('active')
        }
    }
    static abrir() {
        const sidebar = document.getElementById('sidebar')
        sidebar.classList.add('active')
        const overlay = document.getElementById('sidebarOverlay')
        overlay.classList.add('active')
    }
    static marcarAtivo() {
        const pagina = window.location.pathname.split('/').pop() || 'dashboard.html'
        const itens = document.querySelectorAll('.nav-item')
        itens.forEach(item => {
            const href = item.getAttribute('href')
            if (href === pagina) {
                item.classList.add('ativo')
            }
        })
    }
}
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('sidebar')) {
        SidebarNavegacao.marcarAtivo()
    }
})
