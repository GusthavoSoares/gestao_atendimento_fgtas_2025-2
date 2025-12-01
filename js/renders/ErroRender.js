class ErroRender {
    static renderizar(tipo) {
        const erros = {
            'acesso-negado': {
                icon: '<i class="fas fa-ban error-icon acesso-negado"></i>',
                code: '403',
                title: 'Acesso Negado',
                message: 'Você não possui permissão para acessar esta página.<br>Apenas administradores têm acesso a este recurso.'
            },
            '404': {
                icon: '<i class="fas fa-exclamation-triangle error-icon not-found"></i>',
                code: '404',
                title: 'Página Não Encontrada',
                message: 'A página que você está procurando não existe ou foi movida.<br>Verifique o endereço e tente novamente.'
            },
            'default': {
                icon: '<i class="fas fa-exclamation-circle error-icon not-found"></i>',
                code: '500',
                title: 'Erro Interno',
                message: 'Ocorreu um erro inesperado.<br>Por favor, tente novamente mais tarde.'
            }
        }

        const erro = erros[tipo] || erros['default']

        return `
            ${erro.icon}
            <div class="error-code">${erro.code}</div>
            <h1 class="error-title">${erro.title}</h1>
            <p class="error-message">${erro.message}</p>
        `
    }

    static renderizarNoContainer(tipo, containerId = 'errorContent') {
        const container = document.getElementById(containerId)
        if (container) {
            container.innerHTML = this.renderizar(tipo)
        }
    }
}
