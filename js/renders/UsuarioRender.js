class UsuarioRender {
    constructor(dateService) {
        this.dateService = dateService
        this.usuarios = []
    }
    renderizarTabela(usuarios, onEditar, onDeletar) {
        this.usuarios = usuarios
        const tbody = document.querySelector('#tabelaUsuarios tbody')
        tbody.innerHTML = ''
        if (usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4">Nenhum usuário encontrado</td></tr>'
            return
        }
        usuarios.forEach(usuario => {
            const linha = document.createElement('tr')
            linha.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${usuario.tipo_usuario || '-'}</td>
                <td>
                    <span class="badge ${this.getCorStatus(usuario.status)}">
                        ${usuario.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" data-id="${usuario.id}" data-action="editar" title="Editar" aria-label="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-${usuario.status === 'Ativo' ? 'danger' : 'success'}" data-id="${usuario.id}" data-action="deletar" data-status="${usuario.status}" title="${usuario.status === 'Ativo' ? 'Desativar' : 'Ativar'}" aria-label="${usuario.status === 'Ativo' ? 'Desativar' : 'Ativar'}">
                        <i class="fas fa-${usuario.status === 'Ativo' ? 'ban' : 'check'}"></i>
                    </button>
                </td>
            `
            tbody.appendChild(linha)
        })
        tbody.querySelectorAll('[data-action="editar"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id')
                if (onEditar) onEditar(parseInt(id))
            })
        })
        tbody.querySelectorAll('[data-action="deletar"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id')
                const status = e.currentTarget.getAttribute('data-status')
                if (onDeletar) onDeletar(parseInt(id), status)
            })
        })
    }
    getCorStatus(status) {
        return status === 'Ativo' ? 'bg-success' : 'bg-secondary'
    }
}
window.UsuarioRender = UsuarioRender
