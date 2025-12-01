class DashboardUtils {
    static carregarDados() {
        const usuario = Auth.obterUsuario()
        if (!usuario) {
            console.error('Usuário não encontrado no localStorage')
            return
        }
        const nomeUsuario = document.getElementById('nomeUsuario')
        const tipoUsuario = document.getElementById('tipoUsuario')
        const usuarioId = document.getElementById('usuarioId')
        const usuarioNome = document.getElementById('usuarioNome')
        const usuarioEmail = document.getElementById('usuarioEmail')
        const usuarioTipo = document.getElementById('usuarioTipo')
        if (nomeUsuario) nomeUsuario.textContent = usuario.nome
        if (tipoUsuario) tipoUsuario.textContent = `Tipo: ${usuario.tipo_usuario}`
        if (usuarioId) usuarioId.textContent = usuario.id
        if (usuarioNome) usuarioNome.textContent = usuario.nome
        if (usuarioEmail) usuarioEmail.textContent = usuario.email
        if (usuarioTipo) usuarioTipo.textContent = usuario.tipo_usuario
        
        // Esconder card de gerenciar usuários se não for admin
        const isAdmin = usuario.tipo_usuario === 'Administrador' || usuario.tipo_usuario === 'Admin'
        const cardGerenciarUsuarios = document.getElementById('card-gerenciar-usuarios')
        if (cardGerenciarUsuarios && !isAdmin) {
            cardGerenciarUsuarios.style.display = 'none'
        }
        
        const conteudoCarregando = document.getElementById('conteudo-carregando')
        const conteudoPrincipal = document.getElementById('conteudo-principal')
        if (conteudoCarregando) conteudoCarregando.classList.remove('ativo')
        if (conteudoPrincipal) conteudoPrincipal.style.display = 'block'
    }
    static fazerLogout() {
        if (confirm('Tem certeza que deseja sair?')) {
            Auth.fazerLogout()
            window.location.href = '../index.html'
        }
    }
    static mostrarMensagem(texto, tipo) {
        const div = document.querySelector('.container-fluid')
        const alerta = document.createElement('div')
        alerta.className = `alert alert-${tipo} alert-dismissible fade show`
        alerta.role = 'alert'
        alerta.innerHTML = `
            ${texto}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `
        div.insertBefore(alerta, div.firstChild)
        setTimeout(() => alerta.remove(), 5000)
    }
    static configurarLogoutAtalho() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault()
                DashboardUtils.fazerLogout()
            }
        })
    }
}
