class BotoesFiltroRender {
    static renderizarBotoes(containerId = null, mostrarLimpar = true) {
        const htmlLimpar = mostrarLimpar ? `
            <button id="btnLimparFiltros" class="btn btn-light me-2">
                <i class="fas fa-times"></i> Limpar
            </button>
        ` : ''

        const html = `${htmlLimpar}<button id="btnRecarregar" class="btn btn-light">
                <i class="fas fa-sync-alt"></i> Recarregar
            </button>`

        if (containerId) {
            const container = document.getElementById(containerId)
            if (container) {
                container.innerHTML = html
            }
        }

        return html
    }

    static configurarEventos(onLimpar, onRecarregar) {
        const btnLimpar = document.getElementById('btnLimparFiltros')
        const btnRecarregar = document.getElementById('btnRecarregar')

        if (btnLimpar && typeof onLimpar === 'function') {
            btnLimpar.addEventListener('click', onLimpar)
        }

        if (btnRecarregar && typeof onRecarregar === 'function') {
            btnRecarregar.addEventListener('click', onRecarregar)
        }
    }
}
