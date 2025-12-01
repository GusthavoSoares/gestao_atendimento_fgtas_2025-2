class NotificationService {
    mostrarMensagem(texto, tipo = 'info') {
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
        setTimeout(() => alerta.remove(), 2000)
    }
    mostrarErro(texto) {
        this.mostrarMensagem(texto, 'danger')
    }
    mostrarSucesso(texto) {
        this.mostrarMensagem(texto, 'success')
    }
    mostrarAviso(texto) {
        this.mostrarMensagem(texto, 'warning')
    }
    mostrarInfo(texto) {
        this.mostrarMensagem(texto, 'info')
    }
}
window.NotificationService = NotificationService
