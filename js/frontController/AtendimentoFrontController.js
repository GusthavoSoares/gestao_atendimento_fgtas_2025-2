class AtendimentoFrontController {
    constructor() {
        try {
            this.API_BASE_URL = 'http://localhost:8001'
            this.atendimentos = []
            this.filtroStatus = 'todos'
            this.filtroSolicitante = ''
            this.filtroTipo = 'todos'
            this.tiposOcorrencia = []
            this.notification = new NotificationService()
            this.modal = new ModalAtendimento(this.API_BASE_URL)
            this.render = new AtendimentoRender()
            this.filtroRender = new FiltroRender()
            this.inicializarListagem()
        } catch (error) {
            console.error('Erro ao inicializar AtendimentoFrontController:', error)
        }
    }
    async inicializarListagem() {
        try {
            await Promise.all([
                this.carregarAtendimentos(),
                this.carregarTiposOcorrencia(),
                this.modal.carregarDadosSelects()
            ])
            this.configurarFiltros()

            // Configurar botão de novo atendimento
            const btnNovo = document.getElementById('btnNovoAtendimento')
            if (btnNovo) {
                btnNovo.addEventListener('click', () => {
                    this.modal.abrirModalCriar(async () => {
                        await this.carregarAtendimentos()
                    })
                })
            }

            // Preenche selects da modal de criação apenas se os elementos existirem no DOM
            if (document.getElementById('solicitanteCriar')) {
                this.modal.preencherSelects('Criar')
            }
        } catch (error) {
            console.error('Erro ao inicializar listagem de atendimentos:', error)
        }
    }
    async carregarTiposOcorrencia() {
        try {
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/tiposOcorrencias`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!resposta.ok) return
            this.tiposOcorrencia = await resposta.json()
            this.popularFiltroTipo()
        } catch (erro) {
            console.error('Erro ao carregar tipos de ocorrência:', erro)
        }
    }
    popularFiltroTipo() {
        const sel = document.getElementById('filtroTipo')
        if (!sel) return
        this.tiposOcorrencia.forEach(t => {
            const opt = document.createElement('option')
            opt.value = t.tipo
            opt.textContent = t.tipo
            sel.appendChild(opt)
        })
    }
    configurarFiltros() {
        const filtroSelect = document.getElementById('filtroStatus')
        const filtroSol = document.getElementById('filtroSolicitante')
        const filtroTipo = document.getElementById('filtroTipo')

        if (filtroSelect) {
            filtroSelect.addEventListener('change', (e) => {
                this.filtroStatus = e.target.value
                this.renderizarTabela()
            })
        }
        if (filtroSol) {
            filtroSol.addEventListener('input', (e) => {
                this.filtroSolicitante = e.target.value.toLowerCase()
                this.renderizarTabela()
            })
        }
        if (filtroTipo) {
            filtroTipo.addEventListener('change', (e) => {
                this.filtroTipo = e.target.value
                this.renderizarTabela()
            })
        }

        BotoesFiltroRender.renderizarBotoes('botoesFiltroContainer')
        BotoesFiltroRender.configurarEventos(
            () => this.limparFiltros(),
            async () => await this.recarregarDados()
        )
    }

    limparFiltros() {
        this.filtroStatus = 'todos'
        this.filtroSolicitante = ''
        this.filtroTipo = 'todos'
        const filtroStatus = document.getElementById('filtroStatus')
        const filtroSol = document.getElementById('filtroSolicitante')
        const filtroTipo = document.getElementById('filtroTipo')
        if (filtroStatus) filtroStatus.value = 'todos'
        if (filtroSol) filtroSol.value = ''
        if (filtroTipo) filtroTipo.value = 'todos'
        this.renderizarTabela()
        this.notification.mostrarSucesso('Filtros limpos com sucesso!')
    }

    async recarregarDados() {
        await this.carregarAtendimentos()
        this.notification.mostrarSucesso('Dados recarregados com sucesso!')
    }
    async carregarAtendimentos() {
        try {
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/atendimentos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!resposta.ok) throw new Error('Erro ao carregar atendimentos')
            const dados = await resposta.json()
            this.atendimentos = dados
            this.filtroRender.renderizarSelectStatus('filtroStatus', this.atendimentos.map(a => a.status))
            this.renderizarTabela()
        } catch (erro) {
            UIMiddleware.mostrarMensagem(erro.message, 'danger', null, 0)
        }
    }
    renderizarTabela() {
        let atendimentosFiltrados = [...this.atendimentos].sort((a, b) => a.id - b.id)
        if (this.filtroStatus !== 'todos') {
            atendimentosFiltrados = atendimentosFiltrados.filter(a => {
                const status = (a.status || '').trim()
                return status.toLowerCase() === this.filtroStatus.toLowerCase()
            })
        }
        if (this.filtroSolicitante) {
            atendimentosFiltrados = atendimentosFiltrados.filter(a =>
                (a.nome_solicitante || '').toLowerCase().includes(this.filtroSolicitante)
            )
        }
        if (this.filtroTipo !== 'todos') {
            atendimentosFiltrados = atendimentosFiltrados.filter(a => a.tipo_ocorrencia === this.filtroTipo)
        }
        this.render.renderizarTabela(
            atendimentosFiltrados,
            (id) => this.abrirModalEditar(id),
            (id, status) => this.toggleStatus(id, status),
            (id) => this.deletarAtendimento(id)
        )
    }
    async toggleStatus(id, statusAtual) {
        const novoStatus = statusAtual === 'Em Andamento' ? 'Finalizado' : 'Em Andamento'
        const acao = statusAtual === 'Em Andamento' ? 'finalizar' : 'reabrir'

        if (!confirm(`Tem certeza que deseja ${acao} este atendimento?`)) return

        try {
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/atendimentos/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: novoStatus,
                    data_fim: novoStatus === 'Finalizado' ? new DateService().agoraISOBrasilia() : null
                })
            })
            if (!resposta.ok) throw new Error(`Erro ao ${acao} atendimento`)
            this.notification.mostrarSucesso(`Atendimento ${statusAtual === 'Em Andamento' ? 'finalizado' : 'reaberto'} com sucesso!`)
            await this.carregarAtendimentos()
        } catch (erro) {
            this.notification.mostrarErro(erro.message)
        }
    }

    async deletarAtendimento(id) {
        if (!PermissaoAdmin.verificarPermissao(false)) {
            this.notification.mostrarErro('Apenas administradores podem excluir atendimentos permanentemente!')
            return
        }
        if (!confirm('Tem certeza que deseja excluir este atendimento? Esta ação não pode ser desfeita.')) return

        try {
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/atendimentos/${id}/deletar`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!resposta.ok) throw new Error('Erro ao excluir atendimento')
            this.notification.mostrarSucesso('Atendimento excluído com sucesso!')
            await this.carregarAtendimentos()
        } catch (erro) {
            this.notification.mostrarErro(erro.message)
        }
    }
    criarAtendimento() {
        this.modal.criar(async () => {
            await this.carregarAtendimentos()
        })
    }
    async abrirModalEditar(id) {
        await this.modal.abrirModalEditar(id, {
            onError: (mensagem) => this.render.mostrarMensagem(mensagem, 'danger')
        })
    }
    async salvarEdicao() {
        await this.modal.salvarEdicao(async () => {
            await this.carregarAtendimentos()
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
}
// Não auto-instanciar - será instanciado pelo Inicializador
window.AtendimentoFrontController = AtendimentoFrontController
