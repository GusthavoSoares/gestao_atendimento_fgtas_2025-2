class TipoSolicitanteRender {
    constructor() {
        this.tbody = document.getElementById('tabelaTiposSolicitante')
    }

    getModalTemplates() {
        return `
        <div class="modal fade" id="modalTipoSolicitante" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="modalTipoSolicitanteTitulo">Novo Tipo de Solicitante</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="modalTipoSolicitanteMensagem" class="alert d-none" role="alert"></div>
                        <form id="formTipoSolicitante">
                            <input type="hidden" id="tipoSolicitanteId">
                            <div class="mb-3">
                                <label for="tipoSolicitante" class="form-label">Tipo *</label>
                                <input type="text" class="form-control" id="tipoSolicitante" required>
                            </div>
                            <div class="mb-3">
                                <label for="statusSolicitante" class="form-label">Status *</label>
                                <select class="form-select" id="statusSolicitante" required>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btnSalvarTipoSolicitante">Salvar</button>
                    </div>
                </div>
            </div>
        </div>`
    }

    renderizarTabela(tipos, onEditar, onToggleStatus, onDeletarPermanente) {
        if (!Array.isArray(tipos) || tipos.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum tipo cadastrado</td></tr>'
            return
        }

        this.tbody.innerHTML = ''

        tipos.forEach(t => {
            const ehAdmin = PermissaoAdmin.ehAdmin()

            // botão delete permanente (apenas admin) - sem quebras de linha na string
            const botaoDelete = ehAdmin
                ? `<button class="btn btn-sm btn-danger" data-id="${t.id}" data-action="deletarpermanente" title="Excluir permanentemente" aria-label="Excluir permanentemente"><i class="fas fa-trash"></i></button>`
                : ''

            const tr = document.createElement('tr')

            // uso de text-nowrap + d-flex para garantir que os botões fiquem em linha sem quebra
            tr.innerHTML = `
                <td>${t.id}</td>
                <td>${t.tipo}</td>
                <td>
                    <span class="badge ${t.status === 'Ativo' ? 'bg-success' : 'bg-secondary'}">
                        ${t.status}
                    </span>
                </td>
                <td class="text-nowrap">
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-primary" data-id="${t.id}" data-action="editar" title="Editar" aria-label="Editar">
                            <i class="fas fa-edit"></i>
                        </button>

                        <button class="btn btn-sm ${t.status === 'Ativo' ? 'btn-danger' : 'btn-success'}"
                                data-id="${t.id}"
                                data-action="toggle"
                                data-status="${t.status}"
                                title="${t.status === 'Ativo' ? 'Desativar' : 'Ativar'}"
                                aria-label="${t.status === 'Ativo' ? 'Desativar' : 'Ativar'}">
                            <i class="fas fa-${t.status === 'Ativo' ? 'ban' : 'check'}"></i>
                        </button>

                        ${botaoDelete}
                    </div>
                </td>
            `

            // Eventos (verifica existência antes)
            const btnEditar = tr.querySelector('[data-action="editar"]')
            if (btnEditar) btnEditar.addEventListener('click', () => onEditar && onEditar(t.id))

            const btnToggle = tr.querySelector('[data-action="toggle"]')
            if (btnToggle) btnToggle.addEventListener('click', () => onToggleStatus && onToggleStatus(t.id, t.status))

            const btnDelPerm = tr.querySelector('[data-action="deletarpermanente"]')
            if (ehAdmin && btnDelPerm) btnDelPerm.addEventListener('click', () => onDeletarPermanente && onDeletarPermanente(t.id))

            this.tbody.appendChild(tr)
        })
    }
}

window.TipoSolicitanteRender = TipoSolicitanteRender
