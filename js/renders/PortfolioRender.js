class PortfolioRender {
    constructor(dateService) {
        this.dateService = dateService
        this.portfolios = []
    }
    getModalTemplates() {
        return `
        <div class="modal fade" id="modalPortfolio" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="modalPortfolioTitulo">Novo Portfólio</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="modalPortfolioMensagem" class="alert d-none" role="alert"></div>
                        <form id="formPortfolio">
                            <input type="hidden" id="portfolioId">
                            <input type="hidden" id="statusPortfolio" value="Ativo">
                            <div class="mb-3">
                                <label for="nomePortfolio" class="form-label">Nome do Portfólio</label>
                                <input type="text" class="form-control" id="nomePortfolio" required>
                            </div>
                            <div class="mb-3">
                                <label for="tipoSolicitantePortfolio" class="form-label">Tipo de Solicitante</label>
                                <select class="form-select" id="tipoSolicitantePortfolio" required>
                                    <option value="">Selecione...</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btnSalvarPortfolio">Salvar</button>
                    </div>
                </div>
            </div>
        </div>`
    }
    renderizarTabela(portfolios, onEditar, onDeletar, onDeletarPermanente) {
        this.portfolios = portfolios
        const tbody = document.getElementById('tabelaPortfolios')
        tbody.innerHTML = ''
        if (portfolios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Nenhum portfólio encontrado</td></tr>'
            return
        }
        portfolios.forEach(portfolio => {
            const ehAdmin = PermissaoAdmin.ehAdmin()
            const botaoDelete = ehAdmin ? `<button class="btn btn-sm btn-danger" data-id="${portfolio.id}" data-action="deletarpermanente" title="Excluir permanentemente" aria-label="Excluir permanentemente">
                        <i class="fas fa-trash"></i>
                    </button>` : ''
            const linha = document.createElement('tr')
            linha.innerHTML = `
                <td>${portfolio.id}</td>
                <td>${portfolio.nome}</td>
                <td>${portfolio.tipo_solicitante || '-'}</td>
                <td>
                    <span class="badge ${this.getCorStatus(portfolio.status)}">
                        ${portfolio.status}
                    </span>
                </td>
                <td>
                    <div class="d-flex flex-nowrap">
                        <button class="btn btn-sm btn-primary me-2" data-id="${portfolio.id}" data-action="editar" title="Editar" aria-label="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-${portfolio.status === 'Ativo' ? 'danger' : 'success'}${ehAdmin ? ' me-2' : ''}" data-id="${portfolio.id}" data-action="deletar" data-status="${portfolio.status}" title="${portfolio.status === 'Ativo' ? 'Desativar' : 'Ativar'}" aria-label="${portfolio.status === 'Ativo' ? 'Desativar' : 'Ativar'}">
                            <i class="fas fa-${portfolio.status === 'Ativo' ? 'ban' : 'check'}"></i>
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
window.PortfolioRender = PortfolioRender
