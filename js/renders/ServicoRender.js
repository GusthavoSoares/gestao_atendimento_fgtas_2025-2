class ServicoRender {
    constructor(dateService) {
        this.dateService = dateService
        this.servicos = []
    }
    renderizarTabela(servicos, onEditar, onDeletar) {
        this.servicos = servicos
        const tbody = document.getElementById('tabelaServicos')
        tbody.innerHTML = ''
        if (servicos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Nenhum serviço encontrado</td></tr>'
            return
        }
        servicos.forEach(servico => {
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
                    <button class="btn btn-sm btn-primary me-2" data-id="${servico.id}" data-action="editar" title="Editar" aria-label="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-${servico.status === 'Ativo' ? 'danger' : 'success'}" data-id="${servico.id}" data-action="deletar" data-status="${servico.status}" title="${servico.status === 'Ativo' ? 'Desativar' : 'Ativar'}" aria-label="${servico.status === 'Ativo' ? 'Desativar' : 'Ativar'}">
                        <i class="fas fa-${servico.status === 'Ativo' ? 'ban' : 'check'}"></i>
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
window.ServicoRender = ServicoRender
