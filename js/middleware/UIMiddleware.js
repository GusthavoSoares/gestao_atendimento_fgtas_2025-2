class UIMiddleware {
    static mostrarMensagem(texto, tipo = 'info', containerId = null, duracao = 5000) {
        let container
        if (containerId) {
            container = document.getElementById(containerId)
        } else {
            container = document.getElementById('mensagem-container')
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
        }
        const alerta = document.createElement('div')
        alerta.className = `alert alert-${tipo} alert-dismissible fade show`
        alerta.role = 'alert'
        alerta.innerHTML = `
            ${texto}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
        `
        container.appendChild(alerta)
        if (duracao > 0) {
            setTimeout(() => {
                if (alerta.parentElement) {
                    alerta.remove()
                }
            }, duracao)
        }
        return alerta
    }
    static limparMensagens(containerId = null) {
        const container = containerId
            ? document.getElementById(containerId)
            : document.getElementById('mensagem-container')
        if (container) {
            const alertas = container.querySelectorAll('.alert')
            alertas.forEach(alerta => alerta.remove())
        }
    }
    static mostrarCarregamento(elemento, ativo, textoCarregando = 'Carregando...', textoOriginal = null) {
        const btn = typeof elemento === 'string' ? document.getElementById(elemento) : elemento
        if (!btn) return
        if (ativo) {
            btn.disabled = true
            btn.dataset.originalText = btn.innerHTML
            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${textoCarregando}`
        } else {
            btn.disabled = false
            btn.innerHTML = textoOriginal || btn.dataset.originalText || btn.innerHTML
        }
    }
    static confirmar(mensagem, titulo = 'Confirmação') {
        return new Promise((resolve) => {
            const resultado = window.confirm(mensagem)
            resolve(resultado)
        })
    }
    static mostrarLoadingOverlay(mostrar, texto = 'Carregando...') {
        let overlay = document.getElementById('loading-overlay')
        if (mostrar) {
            if (!overlay) {
                overlay = document.createElement('div')
                overlay.id = 'loading-overlay'
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                `
                overlay.innerHTML = `
                    <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
                        <i class="fas fa-spinner fa-spin fa-3x text-primary"></i>
                        <p class="mt-3 mb-0">${texto}</p>
                    </div>
                `
                document.body.appendChild(overlay)
            }
            overlay.style.display = 'flex'
        } else {
            if (overlay) {
                overlay.style.display = 'none'
            }
        }
    }
    static mostrarToast(texto, tipo = 'info', duracao = 3000) {
        let container = document.getElementById('toast-container')
        if (!container) {
            container = document.createElement('div')
            container.id = 'toast-container'
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
            `
            document.body.appendChild(container)
        }
        const toast = document.createElement('div')
        toast.className = `toast align-items-center text-white bg-${tipo} border-0`
        toast.setAttribute('role', 'alert')
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${texto}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `
        container.appendChild(toast)
        const bsToast = new bootstrap.Toast(toast, { delay: duracao })
        bsToast.show()
        toast.addEventListener('hidden.bs.toast', () => toast.remove())
    }
}
window.UIMiddleware = UIMiddleware
