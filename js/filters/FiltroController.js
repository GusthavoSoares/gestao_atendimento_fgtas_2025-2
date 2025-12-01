class FiltroController {
    constructor(onAplicarFiltros) {
        this.filtros = {}
        this.onAplicarFiltros = onAplicarFiltros
        this.btnAplicar = null
    }
    registrarFiltro(nome, valorInicial = 'todos') {
        this.filtros[nome] = valorInicial
    }
    obterValorFiltro(nome) {
        return this.filtros[nome] || 'todos'
    }
    atualizarFiltro(nome, valor) {
        this.filtros[nome] = valor
    }
    configurarBotaoAplicar(idBotao) {
        this.btnAplicar = document.getElementById(idBotao)
        if (this.btnAplicar) {
            this.btnAplicar.addEventListener('click', () => {
                if (this.onAplicarFiltros) {
                    this.onAplicarFiltros(this.filtros)
                }
            })
        }
    }
    configurarSelect(idSelect, nomeFiltro) {
        const select = document.getElementById(idSelect)
        if (select) {
            select.addEventListener('change', (e) => {
                this.atualizarFiltro(nomeFiltro, e.target.value)
                if (this.onAplicarFiltros) {
                    this.onAplicarFiltros(this.filtros)
                }
            })
        }
    }
    configurarInput(idInput, nomeFiltro) {
        const input = document.getElementById(idInput)
        if (input) {
            const handler = () => {
                this.atualizarFiltro(nomeFiltro, input.value)
                if (this.onAplicarFiltros) {
                    this.onAplicarFiltros(this.filtros)
                }
            }
            input.addEventListener('input', handler)
            input.addEventListener('change', handler)
        }
    }
    limparFiltros() {
        Object.keys(this.filtros).forEach(key => {
            this.filtros[key] = 'todos'
        })
        document.querySelectorAll('select[id^="filtro"]').forEach(select => {
            select.value = 'todos'
        })
        if (this.onAplicarFiltros) {
            this.onAplicarFiltros(this.filtros)
        }
    }
}
