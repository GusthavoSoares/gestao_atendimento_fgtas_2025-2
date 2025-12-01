class TipoSolicitanteRender {
    constructor() {
        this.tbody = document.getElementById('tabelaTiposSolicitante')
    }
    renderizarTabela(tipos, onEditar, onToggleStatus) {
        if (tipos.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum tipo cadastrado</td></tr>'
            return
        }
        this.tbody.innerHTML = ''
        tipos.forEach(t => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${t.id}</td>
                <td>${t.tipo}</td>
                <td>
                    <span class="badge bg-${t.status === 'Ativo' ? 'success' : 'secondary'}">
                        ${t.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary btn-editar me-2" data-id="${t.id}" title="Editar" aria-label="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-${t.status === 'Ativo' ? 'danger' : 'success'} btn-toggle"
                            data-id="${t.id}" data-status="${t.status}"
                            title="${t.status === 'Ativo' ? 'Desativar' : 'Ativar'}" aria-label="${t.status === 'Ativo' ? 'Desativar' : 'Ativar'}">
                        <i class="fas fa-${t.status === 'Ativo' ? 'ban' : 'check'}"></i>
                    </button>
                </td>
            `
            tr.querySelector('.btn-editar').addEventListener('click', () => onEditar(t.id))
            tr.querySelector('.btn-toggle').addEventListener('click', () => onToggleStatus(t.id, t.status))
            this.tbody.appendChild(tr)
        })
    }
}
window.TipoSolicitanteRender = TipoSolicitanteRender
