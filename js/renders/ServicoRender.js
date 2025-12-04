class ServicoRender {
    constructor(dateService) {
        this.dateService = dateService
        this.servicos = []
    }
    getModalTemplates() {
        return `
        <div class="modal fade" id="modalServico" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="modalServicoTitulo">Novo Serviço</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="modalServicoMensagem" class="alert d-none" role="alert"></div>
                        <form id="formServico">
                            <input type="hidden" id="servicoId">
                            <input type="hidden" id="statusServico" value="Ativo">
                            <div class="mb-3">
                                <label for="nomeServico" class="form-label">Nome do Serviço</label>
                                <input type="text" class="form-control" id="nomeServico" required>
                            </div>
                            <div class="mb-3">
                                <label for="portfolioServico" class="form-label">Portfólio</label>
                                <select class="form-select" id="portfolioServico" required>
                                    <option value="">Selecione...</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btnSalvarServico">Salvar</button>
                    </div>
                </div>
            </div>
        </div>`
    }
    renderizarTabela(servicos, onEditar, onDeletar, onDeletarPermanente) {
        this.servicos = servicos
        const tbody = document.getElementById('tabelaServicos')
        tbody.innerHTML = ''
        if (servicos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Nenhum serviço encontrado</td></tr>'
            return
        }
        servicos.forEach(servico => {
            const ehAdmin = PermissaoAdmin.ehAdmin()
            const botaoDelete = ehAdmin ? `<button class="btn btn-sm btn-danger" data-id="${servico.id}" data-action="deletarpermanente" title="Excluir permanentemente" aria-label="Excluir permanentemente">
                        <i class="fas fa-trash"></i>
                    </button>` : ''
            const linha = document.createElement('tr')
            linha.innerHTML = `
                <td>${servico.id}</td>
                <td>${servico.nome}</td>
                <td>${servico.portfolio || '-'}</td>
                <td>
                    <span class="badge ${this.getCorStatus(servico.status)}">
                        ${servico.status}
                    </span>
                </td>
                <td>
                    <div class="d-flex flex-nowrap">
                        <button class="btn btn-sm btn-primary me-2" data-id="${servico.id}" data-action="editar" title="Editar" aria-label="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-${servico.status === 'Ativo' ? 'danger' : 'success'}${ehAdmin ? ' me-2' : ''}" data-id="${servico.id}" data-action="deletar" data-status="${servico.status}" title="${servico.status === 'Ativo' ? 'Desativar' : 'Ativar'}" aria-label="${servico.status === 'Ativo' ? 'Desativar' : 'Ativar'}">
                            <i class="fas fa-${servico.status === 'Ativo' ? 'ban' : 'check'}"></i>
                        </button>
                        ${botaoDelete}
                    </div>
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
        tbody.querySelectorAll('[data-action="deletarpermanente"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id')
                if (onDeletarPermanente) onDeletarPermanente(parseInt(id))
            })
        })
    }
    getCorStatus(status) {
        return status === 'Ativo' ? 'bg-success' : 'bg-secondary'
    }
}
window.ServicoRender = ServicoRender
