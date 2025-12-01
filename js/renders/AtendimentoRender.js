class AtendimentoRender {
    constructor() {
        this.atendimentos = []
    }
    renderizarTabela(atendimentos, onEditar, onDeletar) {
        this.atendimentos = atendimentos
        const tbody = document.querySelector('#tabelaAtendimentos tbody')
        tbody.innerHTML = ''
        if (atendimentos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4">Nenhum atendimento encontrado</td></tr>'
            return
        }
        atendimentos.forEach(atendimento => {
            const data = this.formatarData(atendimento.data_inicio)
            const linha = document.createElement('tr')
            linha.innerHTML = `
                <td>${atendimento.id}</td>
                <td>${atendimento.nome_solicitante || '-'}</td>
                <td>${data}</td>
                <td>${atendimento.data_fim ? this.formatarData(atendimento.data_fim) : '-'}</td>
                <td>${atendimento.portfolio || '-'}</td>
                <td>${atendimento.servico || '-'}</td>
                <td>${atendimento.tipo_ocorrencia || '-'}</td>
                <td>
                    <span class="badge ${this.getCorStatus(atendimento.status)}">
                        ${atendimento.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" data-id="${atendimento.id}" data-action="editar" title="Editar" aria-label="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-${atendimento.status === 'Em Andamento' ? 'danger' : 'success'}" data-id="${atendimento.id}" data-action="deletar" data-status="${atendimento.status}" title="${atendimento.status === 'Em Andamento' ? 'Finalizar' : 'Reabrir'}" aria-label="${atendimento.status === 'Em Andamento' ? 'Finalizar' : 'Reabrir'}">
                        <i class="fas fa-${atendimento.status === 'Em Andamento' ? 'ban' : 'check'}"></i>
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
        const cores = {
            'Em Andamento': 'bg-warning',
            'Finalizado': 'bg-success',
            'Cancelado': 'bg-danger'
        }
        return cores[status] || 'bg-secondary'
    }
    formatarData(dataStr) {
        if (!dataStr) return '-'
        try {
            const data = new Date(dataStr.replace('Z', ''))
            if (isNaN(data.getTime())) return '-'
            return data.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
        } catch (e) {
            return '-'
        }
    }
    mostrarMensagem(texto, tipo) {
        let container = document.getElementById('mensagem-container')
        if (!container) {
            container = document.createElement('div')
            container.id = 'mensagem-container'
            container.className = 'container mt-3'
            const body = document.body
            const firstChild = body.querySelector('.container, .container-fluid')
            if (firstChild) {
                body.insertBefore(container, firstChild)
            } else {
                body.insertBefore(container, body.firstChild)
            }
        }
        const alerta = document.createElement('div')
        alerta.className = `alert alert-${tipo} alert-dismissible fade show`
        alerta.role = 'alert'
        alerta.innerHTML = `
            ${texto}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `
        container.appendChild(alerta)
        setTimeout(() => alerta.remove(), 5000)
    }
}
window.AtendimentoRender = AtendimentoRender
