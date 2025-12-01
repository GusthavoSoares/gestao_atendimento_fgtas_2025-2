class TipoOcorrenciaRender {
    constructor() {
        this.tbody = document.getElementById('tabelaTiposOcorrencia')
    }
    renderizarTabela(tipos, onEditar, onDeletar) {
        if (tipos.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum tipo cadastrado</td></tr>'
            return
        }
        this.tbody.innerHTML = ''
        tipos.forEach(t => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${t.id}</td>
                <td>${t.tipo || t.descricao}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-editar me-2" data-id="${t.id}" title="Editar" aria-label="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-deletar" data-id="${t.id}" title="Excluir" aria-label="Excluir">
                        <i class="fas fa-ban"></i>
                    </button>
                </td>
            `
            tr.querySelector('.btn-editar').addEventListener('click', () => onEditar(t.id))
            tr.querySelector('.btn-deletar').addEventListener('click', () => onDeletar(t.id))
            this.tbody.appendChild(tr)
        })
    }
}
window.TipoOcorrenciaRender = TipoOcorrenciaRender
