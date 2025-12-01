class ErroFrontController {
    constructor() {
        this.tipoErro = this.obterTipoErro()
        this.inicializar()
    }

    obterTipoErro() {
        const urlParams = new URLSearchParams(window.location.search)
        return urlParams.get('tipo') || '404'
    }

    inicializar() {
        this.renderizarErro()
        this.configurarBotaoVoltar()
    }

    renderizarErro() {
        ErroRender.renderizarNoContainer(this.tipoErro, 'errorContent')
    }

    voltarPagina() {
        if (this.tipoErro === 'acesso-negado') {
            window.location.href = 'dashboard.html'
        } else {
            if (window.history.length > 1) {
                window.history.back()
            } else {
                window.location.href = 'dashboard.html'
            }
        }
    }

    configurarBotaoVoltar() {
        const btnVoltar = document.getElementById('btnVoltar')
        if (btnVoltar) {
            btnVoltar.addEventListener('click', () => this.voltarPagina())
        }
    }
}
