class PortfolioRender {
    constructor(dateService) {
        this.dateService = dateService
        this.portfolios = []
    }
    renderizarTabela(portfolios, onEditar, onDeletar) {
        this.portfolios = portfolios
        const tbody = document.getElementById('tabelaPortfolios')
        tbody.innerHTML = ''
        if (portfolios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Nenhum portfólio encontrado</td></tr>'
            return
        }
        portfolios.forEach(portfolio => {
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
                    <button class="btn btn-sm btn-primary me-2" data-id="${portfolio.id}" data-action="editar" title="Editar" aria-label="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-${portfolio.status === 'Ativo' ? 'danger' : 'success'}" data-id="${portfolio.id}" data-action="deletar" data-status="${portfolio.status}" title="${portfolio.status === 'Ativo' ? 'Desativar' : 'Ativar'}" aria-label="${portfolio.status === 'Ativo' ? 'Desativar' : 'Ativar'}">
                        <i class="fas fa-${portfolio.status === 'Ativo' ? 'ban' : 'check'}"></i>
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
                if (onDeletar) onDeletar(parseInt(id))
            })
        })
    }
    getCorStatus(status) {
        return status === 'Ativo' ? 'bg-success' : 'bg-secondary'
    }
}
window.PortfolioRender = PortfolioRender
