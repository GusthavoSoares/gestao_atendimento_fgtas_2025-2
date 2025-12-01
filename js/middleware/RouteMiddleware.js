class RouteMiddleware {
    static validarRota() {
        const path = window.location.pathname
        const paginasValidas = [
            '/index.html',
            '/pages/dashboard.html',
            '/pages/usuarios.html',
            '/pages/atendimentos.html',
            '/pages/portfolios.html',
            '/pages/servicos.html',
            '/pages/solicitantes.html',
            '/pages/tipos-usuario.html',
            '/pages/tipos-solicitante.html',
            '/pages/tipos-ocorrencia.html',
            '/pages/relatorios.html',
            '/pages/esqueci-senha.html',
            '/pages/erro.html'
        ]
        
        // Normaliza o caminho removendo possíveis duplicações de barras
        const pathNormalizado = path.replace(/\/+/g, '/').toLowerCase()
        
        // Verifica se está na raiz do projeto
        if (pathNormalizado === '/' || pathNormalizado === '') {
            return true
        }
        
        // Extrai apenas o caminho do arquivo sem query strings
        const pathSemQuery = pathNormalizado.split('?')[0]
        
        // Verifica se a página existe na lista de páginas válidas
        const paginaValida = paginasValidas.some(pagina => 
            pathSemQuery.endsWith(pagina.toLowerCase())
        )
        
        if (!paginaValida) {
            this.redirecionarParaErro404()
            return false
        }
        
        return true
    }
    
    static redirecionarParaErro404() {
        const path = window.location.pathname
        const caminhoErro = path.includes('/pages/') 
            ? '../pages/erro.html?tipo=404'
            : 'pages/erro.html?tipo=404'
        
        // Evita loop infinito se já estiver na página de erro
        if (!path.includes('erro.html')) {
            window.location.href = caminhoErro
        }
    }
    
    static inicializar() {
        // Executa a validação imediatamente, sem esperar o DOM
        this.validarRota()
    }
}

// Auto-inicializa o middleware de rotas imediatamente
RouteMiddleware.inicializar()
