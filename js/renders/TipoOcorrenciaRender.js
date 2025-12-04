class TipoOcorrenciaRender {
    constructor() {
        this.tbody = document.getElementById('tabelaTiposOcorrencia')
    }

    getModalTemplates() {
        return `
        <div class="modal fade" id="modalTipoOcorrencia" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="modalTipoOcorrenciaTitulo">Novo Tipo de Ocorrência</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="modalTipoOcorrenciaMensagem" class="alert d-none" role="alert"></div>
                        <form id="formTipoOcorrencia">
                            <input type="hidden" id="tipoOcorrenciaId">
                            <div class="mb-3">
                                <label for="descricaoOcorrencia" class="form-label">Descrição *</label>
                                <input type="text" class="form-control" id="descricaoOcorrencia" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btnSalvarTipoOcorrencia">Salvar</button>
                    </div>
                </div>
            </div>
        </div>`
    }

    renderizarTabela(tipos, onEditar) {
        if (!Array.isArray(tipos) || tipos.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum tipo cadastrado</td></tr>'
            return
        }

        this.tbody.innerHTML = ''

        tipos.forEach(t => {
            const botoes = []

            botoes.push(`
                <button class="btn btn-sm btn-primary" data-id="${t.id}" data-action="editar" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
            `)

            const tr = document.createElement('tr')

            tr.innerHTML = `
                <td>${t.id}</td>
                <td>${t.tipo || t.descricao}</td>
                <td>
                    <div class="d-flex gap-2 flex-nowrap">
                        ${botoes.join('')}
                    </div>
                </td>
            `

            const btnEditar = tr.querySelector('[data-action="editar"]')
            if (btnEditar && typeof onEditar === 'function') {
                btnEditar.addEventListener('click', () => onEditar(t.id))
            }

            this.tbody.appendChild(tr)
        })
    }
}

window.TipoOcorrenciaRender = TipoOcorrenciaRender
