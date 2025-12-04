class TipoUsuarioFrontController {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8001'
        this.tiposUsuarioOriginal = []
        this.filtroStatusTipoUsuario = 'todos'
        this.http = new HttpService(this.API_BASE_URL)
        this.notification = new NotificationService()
        this.filtroRender = new FiltroRender()
        this.modal = new ModalTipoUsuario(this.API_BASE_URL, this.http)
        this.render = new TipoUsuarioRender()
        this.inicializar()
    }
    async inicializar() {
        await this.carregarTiposUsuario()

        // Aguarda o DOM estar pronto antes de renderizar botões
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.configurarInterface()
            })
        } else {
            this.configurarInterface()
        }
    }

    configurarInterface() {
        BotoesFiltroRender.renderizarBotoes('botoesFiltroContainer')
        BotoesFiltroRender.configurarEventos(
            () => this.limparFiltros(),
            async () => {
                await this.carregarTiposUsuario()
                this.notification.mostrarSucesso('Dados recarregados com sucesso!')
            }
        )

        const btnNovo = document.getElementById('btnNovoTipoUsuario')
        if (btnNovo) {
            btnNovo.addEventListener('click', () => {
                this.modal.abrir(() => this.carregarTiposUsuario())
            })
        }

        // Não adicionar listener aqui - será adicionado quando o modal for aberto
        // document.getElementById('btnSalvarTipoUsuario').addEventListener('click', () => this.salvarTipoUsuario())
        const filtroStatus = document.getElementById('filtroStatusTipoUsuario')
        if (filtroStatus) {
            const renderDebounced = (typeof debounce === 'function')
                ? debounce(() => this.aplicarFiltro(), 120)
                : () => this.aplicarFiltro()
            filtroStatus.addEventListener('change', (e) => {
                this.filtroStatusTipoUsuario = e.target.value
                renderDebounced()
            })
        }
    }
    limparFiltros() {
        this.filtroStatusTipoUsuario = 'todos'
        const filtroStatus = document.getElementById('filtroStatusTipoUsuario')
        if (filtroStatus) filtroStatus.value = 'todos'
        this.aplicarFiltro()
    }
    async carregarTiposUsuario() {
        try {
            this.tiposUsuarioOriginal = await this.http.get('/tiposUsuarios')
            this.filtroRender.renderizarSelectStatus('filtroStatusTipoUsuario', this.tiposUsuarioOriginal.map(t => t.status))
            this.aplicarFiltro()
        } catch (erro) {
            this.notification.mostrarErro('Erro ao carregar tipos de usuário')
        }
    }
    aplicarFiltro() {
        let tipos = [...this.tiposUsuarioOriginal]
        if (this.filtroStatusTipoUsuario !== 'todos') {
            tipos = tipos.filter(t => {
                const status = (t.status || '').trim()
                return status.toLowerCase() === this.filtroStatusTipoUsuario.toLowerCase()
            })
        }
        this.renderizarTabela(tipos)
    }
    renderizarTabela(tipos) {
        this.render.renderizarTabela(
            tipos,
            (id) => this.editarTipoUsuario(id),
            (id, status) => this.toggleStatus(id, status),
            (id) => this.deletarPermanente(id)
        )
    }
    async deletarPermanente(id) {
        if (!PermissaoAdmin.verificarPermissao(false)) {
            this.notification.mostrarErro('Apenas administradores podem excluir tipos permanentemente!')
            return
        }
        if (!confirm('Tem certeza que deseja excluir este tipo permanentemente? Esta ação não pode ser desfeita.')) return
        try {
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/tiposUsuarios/${id}/deletar`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!resposta.ok) throw new Error('Erro ao excluir tipo')
            this.notification.mostrarSucesso('Tipo excluído com sucesso!')
            await this.carregarTiposUsuario()
        } catch (erro) {
            this.notification.mostrarErro(erro.message)
        }
    }
    async editarTipoUsuario(id) {
        this.modal.abrirEditar(id, {
            onError: (erro) => this.notification.mostrarErro('Erro ao carregar tipo')
        })
    }
    async salvarTipoUsuario() {
        this.modal.salvar({
            onSuccess: () => {
                this.notification.mostrarSucesso('Tipo salvo com sucesso!')
                this.carregarTiposUsuario()
            },
            onError: (erro) => this.notification.mostrarErro(erro)
        })
    }
    async toggleStatus(id, statusAtual) {
        if (!confirm(`Deseja realmente ${statusAtual === 'Ativo' ? 'desativar' : 'ativar'} este tipo?`)) {
            return
        }
        try {
            const novoStatus = statusAtual === 'Ativo' ? 'Inativo' : 'Ativo'
            await this.http.put(`/tiposUsuarios/${id}`, { status: novoStatus })
            this.notification.mostrarSucesso('Status atualizado com sucesso!')
            await this.carregarTiposUsuario()
        } catch (erro) {
            this.notification.mostrarErro('Erro ao atualizar status')
        }
    }
}
// Não auto-instanciar - será instanciado pelo Inicializador
window.TipoUsuarioFrontController = TipoUsuarioFrontController
