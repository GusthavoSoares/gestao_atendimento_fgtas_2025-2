class SolicitanteRender {
    constructor(dateService, validationService) {
        this.dateService = dateService
        this.validation = validationService
        this.solicitantes = []
    }

    getModalTemplates() {
        return `
        <div class="modal fade" id="modalSolicitante" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="modalSolicitanteTitulo">Novo Solicitante</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="modalSolicitanteMensagem" class="alert d-none" role="alert"></div>
                        <form id="formSolicitante">
                            <input type="hidden" id="solicitanteId">
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="nomeSolicitante" class="form-label">Nome Completo</label>
                                    <input type="text" class="form-control" id="nomeSolicitante" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="tipoSolicitanteSolicitante" class="form-label">Tipo</label>
                                    <select class="form-select" id="tipoSolicitanteSolicitante" required>
                                        <option value="">Selecione...</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="identificacaoSolicitante" class="form-label">CPF/CNPJ</label>
                                    <input type="text" class="form-control" id="identificacaoSolicitante">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="dataNascimentoSolicitante" class="form-label">Data de Nascimento</label>
                                    <input type="text" class="form-control" id="dataNascimentoSolicitante" placeholder="dd/mm/aaaa">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="telefoneSolicitante" class="form-label">Telefone</label>
                                    <input type="tel" class="form-control" id="telefoneSolicitante">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="emailSolicitante" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="emailSolicitante" required>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label for="cepSolicitante" class="form-label">CEP</label>
                                    <input type="text" class="form-control" id="cepSolicitante">
                                </div>
                                <div class="col-md-8 mb-3">
                                    <label for="enderecoSolicitante" class="form-label">Endereço</label>
                                    <input type="text" class="form-control" id="enderecoSolicitante" required>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="statusSolicitante" class="form-label">Status</label>
                                <select class="form-select" id="statusSolicitante" required>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </select>
                            </div>
                        </form>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btnSalvarSolicitante">Salvar</button>
                    </div>
                </div>
            </div>
        </div>`
    }

    /**
     * renderizarTabela(solicitantes, onEditar, onToggleStatus, onDeletarPermanente)
     */
    renderizarTabela(solicitantes, onEditar, onToggleStatus, onDeletarPermanente) {
        const tbody = document.getElementById('tabelaSolicitantes')
        tbody.innerHTML = ''

        if (!solicitantes || solicitantes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4">Nenhum solicitante encontrado</td></tr>'
            return
        }

        solicitantes.forEach(s => {
            const ehAdmin = PermissaoAdmin.ehAdmin()

            const tr = document.createElement('tr')

            const botaoDeletePermanente = ehAdmin ? `
                <button class="btn btn-sm btn-danger"
                        data-id="${s.id}"
                        data-action="deletarpermanente"
                        title="Excluir permanentemente">
                    <i class="fas fa-trash"></i>
                </button>
            ` : ''

            tr.innerHTML = `
                <td>${s.id}</td>
                <td>${s.nome}</td>
                <td>${this.validation.formatarCPFouCNPJ(s.identificacao) || '-'}</td>
                <td>${s.tipo_solicitante || '-'}</td>
                <td>${this.validation.formatarTelefone(s.telefone) || '-'}</td>
                <td>${s.email || '-'}</td>
                <td>
                    <span class="badge ${this.getCorStatus(s.status)}">${s.status}</span>
                </td>

                <td class="text-nowrap">
                    <div class="d-flex align-items-center gap-2">
                        
                        <!-- Editar -->
                        <button class="btn btn-sm btn-primary"
                                data-id="${s.id}" data-action="editar" 
                                title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>

                        <!-- Ativar / Desativar -->
                        <button class="btn btn-sm ${s.status === 'Ativo' ? 'btn-danger' : 'btn-success'}"
                                data-id="${s.id}"
                                data-status="${s.status}"
                                data-action="status"
                                title="${s.status === 'Ativo' ? 'Desativar' : 'Ativar'}">
                            <i class="fas fa-${s.status === 'Ativo' ? 'ban' : 'check'}"></i>
                        </button>

                        <!-- Delete Permanente -->
                        ${botaoDeletePermanente}
                    </div>
                </td>
            `

            // eventos
            tr.querySelector('[data-action="editar"]')
              .addEventListener('click', () => onEditar(s.id))

            tr.querySelector('[data-action="status"]')
              .addEventListener('click', () => onToggleStatus(s.id, s.status))

            if (ehAdmin) {
                tr.querySelector('[data-action="deletarpermanente"]')
                  .addEventListener('click', () => onDeletarPermanente(s.id))
            }

            tbody.appendChild(tr)
        })
    }

    getCorStatus(status) {
        return status === 'Ativo' ? 'bg-success' : 'bg-secondary'
    }
}

window.SolicitanteRender = SolicitanteRender
