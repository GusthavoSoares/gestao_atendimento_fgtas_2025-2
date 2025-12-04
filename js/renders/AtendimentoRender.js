class AtendimentoRender {
    constructor() {
        this.atendimentos = []
    }
    getModalTemplates() {
        return `
        <div class="modal fade modal-blur" id="modalCriarAtendimento" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="fas fa-calendar-plus"></i> Novo Atendimento</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="modalCriarAtendimentoMensagem" class="alert" style="display: none;" role="alert"></div>
                        <form id="formCriarAtendimento">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Solicitante</label>
                                    <select id="solicitanteCriar" class="form-select" required>
                                        <option value="">Selecione...</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Tipo de Ocorrência</label>
                                    <select id="tipoOcorrenciaCriar" class="form-select" required>
                                        <option value="">Selecione...</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Portfolio</label>
                                    <select id="portfolioCriar" class="form-select" required>
                                        <option value="">Selecione...</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Serviço</label>
                                    <select id="servicoCriar" class="form-select" required>
                                        <option value="">Selecione...</option>
                                    </select>
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label">Descrição</label>
                                    <textarea id="descricaoCriar" class="form-control" rows="3"></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" id="btnCriarAtendimento" class="btn btn-primary"><i class="fas fa-save"></i> Criar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modalEditarAtendimento" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="fas fa-calendar-edit"></i> Editar Atendimento</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="modalEditarAtendimentoMensagem" class="alert d-none" role="alert"></div>
                        <form id="formEditarAtendimento">
                            <input type="hidden" id="atendimentoIdEdit">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Solicitante</label>
                                    <select id="solicitanteEdit" class="form-select" required>
                                        <option value="">Selecione...</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Tipo de Ocorrência</label>
                                    <select id="tipoOcorrenciaEdit" class="form-select" required>
                                        <option value="">Selecione...</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Portfolio</label>
                                    <select id="portfolioEdit" class="form-select" required>
                                        <option value="">Selecione...</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Serviço</label>
                                    <select id="servicoEdit" class="form-select" required>
                                        <option value="">Selecione...</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Data do Atendimento <span class="text-muted">(apenas admin)</span></label>
                                    <input type="text" id="dataAtendimentoEdit" class="form-control" placeholder="DD/MM/YYYY HH:MM" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Data de Fim</label>
                                    <input type="text" id="dataFimEdit" class="form-control" placeholder="DD/MM/YYYY HH:MM">
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label">Descrição</label>
                                    <textarea id="descricaoEdit" class="form-control" rows="3"></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Status</label>
                                    <select id="statusEdit" class="form-select" required>
                                        <option value="Aberto">Aberto</option>
                                        <option value="Em Andamento">Em Andamento</option>
                                        <option value="Concluído">Concluído</option>
                                        <option value="Finalizado">Finalizado</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" id="btnSalvarAtendimento" class="btn btn-primary"><i class="fas fa-save"></i> Salvar</button>
                    </div>
                </div>
            </div>
        </div>`
    }
    renderizarTabela(atendimentos, onEditar, onStatus, onDeletarPermanente) {
        this.atendimentos = atendimentos
        const tbody = document.querySelector('#tabelaAtendimentos tbody')
        tbody.innerHTML = ''
        if (atendimentos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center py-4">Nenhum atendimento encontrado</td></tr>'
            return
        }
        atendimentos.forEach(atendimento => {
            const data = this.formatarData(atendimento.data_inicio)
            const ehAdmin = PermissaoAdmin.ehAdmin()
            const botaoDelete = ehAdmin ? `<button class="btn btn-sm btn-danger" data-id="${atendimento.id}" data-action="deletarpermanente" title="Excluir permanentemente" aria-label="Excluir permanentemente">
                        <i class="fas fa-trash"></i>
                    </button>` : ''
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
                    <button class="btn btn-sm btn-${atendimento.status === 'Em Andamento' ? 'danger' : 'success'} me-2" data-id="${atendimento.id}" data-action="status" data-status="${atendimento.status}" title="${atendimento.status === 'Em Andamento' ? 'Finalizar' : 'Reabrir'}" aria-label="${atendimento.status === 'Em Andamento' ? 'Finalizar' : 'Reabrir'}">
                        <i class="fas fa-${atendimento.status === 'Em Andamento' ? 'ban' : 'check'}"></i>
                    </button>
                    ${botaoDelete}
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
        tbody.querySelectorAll('[data-action="status"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id')
                const status = e.currentTarget.getAttribute('data-status')
                if (onStatus) onStatus(parseInt(id), status)
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
