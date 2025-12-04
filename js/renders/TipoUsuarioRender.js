class TipoUsuarioRender {
    constructor() {
        this.tbody = document.getElementById('tabelaTiposUsuario')
    }

    getModalTemplates() {
        return `
        <div class="modal fade" id="modalTipoUsuario" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="modalTipoUsuarioTitulo">Novo Tipo de Usuário</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="modalTipoUsuarioMensagem" class="alert d-none" role="alert"></div>
                        <form id="formTipoUsuario">
                            <input type="hidden" id="tipoUsuarioId">
                            <div class="mb-3">
                                <label for="tipoTipoUsuario" class="form-label">Tipo *</label>
                                <input type="text" class="form-control" id="tipoTipoUsuario" required>
                            </div>
                            <div class="mb-3">
                                <label for="statusTipoUsuario" class="form-label">Status *</label>
                                <select class="form-select" id="statusTipoUsuario" required>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btnSalvarTipoUsuario">
                            <i class="fas fa-save"></i> Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>`
    }

    renderizarTabela(tipos, onEditar, onToggleStatus, onDeletarPermanente) {

        if (tipos.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Nenhum tipo cadastrado</td></tr>'
            return
        }

        this.tbody.innerHTML = ''

        tipos.forEach(t => {

            const ehAdmin = PermissaoAdmin.ehAdmin()

            const botaoDelete = ehAdmin ? `
                <button class="btn btn-sm btn-danger"
                        data-id="${t.id}"
                        data-action="deletarpermanente"
                        title="Excluir permanentemente"
                        aria-label="Excluir permanentemente">
                    <i class="fas fa-trash"></i>
                </button>` : ''

            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${t.id}</td>
                <td>${t.tipo}</td>
                <td>
                    <span class="badge ${t.status === 'Ativo' ? 'bg-success' : 'bg-secondary'}">
                        ${t.status}
                    </span>
                </td>
                <td class="text-nowrap">
                    <button class="btn btn-sm btn-primary me-2"
                            data-id="${t.id}"
                            data-action="editar"
                            title="Editar"
                            aria-label="Editar">
                        <i class="fas fa-edit"></i>
                    </button>

                    <button class="btn btn-sm btn-${t.status === 'Ativo' ? 'danger' : 'success'} me-2"
                            data-id="${t.id}"
                            data-action="status"
                            data-status="${t.status}"
                            title="${t.status === 'Ativo' ? 'Desativar' : 'Ativar'}"
                            aria-label="${t.status === 'Ativo' ? 'Desativar' : 'Ativar'}">
                        <i class="fas fa-${t.status === 'Ativo' ? 'ban' : 'check'}"></i>
                    </button>

                    ${botaoDelete}
                </td>
            `

            // Eventos
            tr.querySelector('[data-action="editar"]')
              .addEventListener('click', () => onEditar(t.id))

            tr.querySelector('[data-action="status"]')
              .addEventListener('click', () => onToggleStatus(t.id, t.status))

            if (ehAdmin && tr.querySelector('[data-action="deletarpermanente"]')) {
                tr.querySelector('[data-action="deletarpermanente"]')
                  .addEventListener('click', () => onDeletarPermanente(t.id))
            }

            this.tbody.appendChild(tr)
        })
    }
}

window.TipoUsuarioRender = TipoUsuarioRender
