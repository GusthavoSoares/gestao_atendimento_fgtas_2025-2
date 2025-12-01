class RelatoriosRender {
    constructor(dateService) {
        this.dateService = dateService
    }
    renderizarTabelaAnalitica(itens) {
        const tbody = document.getElementById('tabelaAnaliticaBody')
        if (!tbody) return
        tbody.innerHTML = ''
        if (!Array.isArray(itens) || itens.length === 0) {
            const tr = document.createElement('tr')
            tr.innerHTML = '<td colspan="9" class="text-center py-4">Nenhum atendimento encontrado</td>'
            tbody.appendChild(tr)
            return
        }
        const ordenados = [...itens].sort((a, b) => a.id - b.id)
        ordenados.forEach(a => {
            const linha = document.createElement('tr')
            linha.innerHTML = `
                <td>${a.id}</td>
                <td>${a.nome_solicitante || '-'}</td>
                <td>${this.dateService.formatarData(a.data_inicio)}</td>
                <td>${a.data_fim ? this.dateService.formatarData(a.data_fim) : '-'}</td>
                <td>${a.portfolio || '-'}</td>
                <td>${a.servico || '-'}</td>
                <td>${a.tipo_ocorrencia || '-'}</td>
                <td><span class="badge ${this.obterCorStatus(a.status)}">${a.status}</span></td>
                <td>${a.descricao || '-'}</td>
            `
            tbody.appendChild(linha)
        })
    }
    obterCorStatus(status) {
        const cores = { 'Em Andamento': 'bg-warning', 'Finalizado': 'bg-success', 'Cancelado': 'bg-danger' }
        return cores[status] || 'bg-secondary'
    }
    renderizarKPIs(atendimentos) {
        const total = atendimentos.length
        const emAndamento = atendimentos.filter(a => a.status === 'Em Andamento').length
        const finalizados = atendimentos.filter(a => a.status === 'Finalizado').length
        const cancelados = atendimentos.filter(a => a.status === 'Cancelado').length
        
        const setKPI = (id, valor) => {
            const el = document.getElementById(id)
            if (el) el.textContent = valor
        }
        
        setKPI('kpiTotal', total)
        setKPI('kpiEmAndamento', emAndamento)
        setKPI('kpiFinalizados', finalizados)
        setKPI('kpiCancelados', cancelados)
    }
}
window.RelatoriosRender = RelatoriosRender
