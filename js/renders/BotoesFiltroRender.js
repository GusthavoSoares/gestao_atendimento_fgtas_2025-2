class BotoesFiltroRender {
    static renderizarBotoes(containerId = null, mostrarLimpar = true) {
        const htmlLimpar = mostrarLimpar ? `
        <div class="col-md-2">
            <label class="form-label">&nbsp;</label>
            <button id="btnLimparFiltros" class="btn btn-secondary w-100">
                <i class="fas fa-times"></i> Limpar
            </button>
        </div>
        ` : ''
        
        const html = `${htmlLimpar}<div class="col-md-2">
            <label class="form-label">&nbsp;</label>
            <button id="btnRecarregar" class="btn btn-primary w-100">
                <i class="fas fa-sync-alt"></i> Recarregar Dados
            </button>
        </div>`
        
        if (containerId) {
            const container = document.getElementById(containerId)
            if (container) {
                container.outerHTML = html
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
