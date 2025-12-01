class SolicitanteRender {
    constructor(dateService, validationService) {
        this.dateService = dateService
        this.validation = validationService
        this.solicitantes = []
    }
    renderizarTabela(solicitantes, onEditar, onDeletar) {
        this.solicitantes = solicitantes
        const tbody = document.getElementById('tabelaSolicitantes')
        tbody.innerHTML = ''
        if (solicitantes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4">Nenhum solicitante encontrado</td></tr>'
            return
        }
        solicitantes.forEach(solicitante => {
            const linha = document.createElement('tr')
            linha.innerHTML = `
                <td>${solicitante.id}</td>
                <td>${solicitante.nome}</td>
                <td>${this.validation.formatarCPFouCNPJ(solicitante.identificacao) || '-'}</td>
                <td>${solicitante.tipo_solicitante || '-'}</td>
                <td>${this.validation.formatarTelefone(solicitante.telefone) || '-'}</td>
                <td>${solicitante.email || '-'}</td>
                <td>
                    <span class="badge ${this.getCorStatus(solicitante.status)}">
                        ${solicitante.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" data-id="${solicitante.id}" data-action="editar" title="Editar" aria-label="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-${solicitante.status === 'Ativo' ? 'danger' : 'success'}" data-id="${solicitante.id}" data-action="deletar" data-status="${solicitante.status}" title="${solicitante.status === 'Ativo' ? 'Desativar' : 'Ativar'}" aria-label="${solicitante.status === 'Ativo' ? 'Desativar' : 'Ativar'}">
                        <i class="fas fa-${solicitante.status === 'Ativo' ? 'ban' : 'check'}"></i>
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
window.SolicitanteRender = SolicitanteRender
