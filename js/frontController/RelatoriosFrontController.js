class RelatoriosFrontController {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8001'
        this.atendimentos = []
        this.filtrados = []
        this.dateService = new DateService()
        this.notification = new NotificationService()
        this.filtroRender = new FiltroRender()
        this.render = new RelatoriosRender(this.dateService)
        this.inicializar()
    }
    async inicializar() {
        await this.carregarAtendimentos()
        this.popularCombos()
        this.configurarEventos()
        this.aplicarFiltros()
    }
    async carregarAtendimentos() {
        try {
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/atendimentos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!resposta.ok) throw new Error('Erro ao carregar atendimentos')
            this.atendimentos = await resposta.json()
        } catch (erro) {
            UIMiddleware.mostrarMensagem(erro.message, 'danger', null, 0)
        }
    }
    configurarEventos() {
        BotoesFiltroRender.renderizarBotoes('botoesFiltroContainer', true)
        BotoesFiltroRender.configurarEventos(
            () => this.limparFiltros(),
            async () => await this.recarregarDados()
        )

        const btnAvancado = document.getElementById('btnFiltroAvancado')
        const btnCSV = document.getElementById('btnExportarCSV')
        const filtroDataInicio = document.getElementById('filtroDataInicio')
        const filtroDataFim = document.getElementById('filtroDataFim')
        const filtroStatus = document.getElementById('filtroStatus')
        const maskDate = (el) => {
            el.addEventListener('input', () => {
                let v = el.value.replace(/\D/g, '').slice(0, 8)
                if (v.length >= 5) el.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`
                else if (v.length >= 3) el.value = `${v.slice(0, 2)}/${v.slice(2)}`
                else el.value = v
            })
        }
        if (filtroDataInicio) {
            maskDate(filtroDataInicio)
            filtroDataInicio.addEventListener('input', () => this.aplicarFiltros())
            filtroDataInicio.addEventListener('change', () => this.aplicarFiltros())
        }
        if (filtroDataFim) {
            maskDate(filtroDataFim)
            filtroDataFim.addEventListener('input', () => this.aplicarFiltros())
            filtroDataFim.addEventListener('change', () => this.aplicarFiltros())
        }
        if (filtroStatus) filtroStatus.addEventListener('change', () => this.aplicarFiltros())
        const filtroPortfolio = document.getElementById('filtroPortfolio')
        const filtroServico = document.getElementById('filtroServico')
        const filtroTipoOcorrencia = document.getElementById('filtroTipoOcorrencia')
        const filtroSolicitante = document.getElementById('filtroSolicitante')
        if (filtroPortfolio) filtroPortfolio.addEventListener('change', () => this.aplicarFiltros())
        if (filtroServico) filtroServico.addEventListener('change', () => this.aplicarFiltros())
        if (filtroTipoOcorrencia) filtroTipoOcorrencia.addEventListener('change', () => this.aplicarFiltros())
        if (filtroSolicitante) filtroSolicitante.addEventListener('input', () => this.aplicarFiltros())
        if (btnCSV) btnCSV.addEventListener('click', () => this.exportarCSV())
        if (btnAvancado) btnAvancado.addEventListener('click', () => {
            const el = document.getElementById('filtrosAvancados')
            if (el) el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'flex' : 'none'
        })
    }
    popularCombos() {
        const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)))
        const setSelect = (id, values) => {
            const sel = document.getElementById(id)
            if (!sel) return
            sel.innerHTML = '<option value="">Todos</option>'
            values.forEach(v => {
                const opt = document.createElement('option')
                opt.value = v
                opt.textContent = v
                sel.appendChild(opt)
            })
        }
        this.filtroRender.renderizarSelectStatus('filtroStatus', this.atendimentos.map(a => a.status))
        setSelect('filtroPortfolio', uniq(this.atendimentos.map(a => a.portfolio)))
        setSelect('filtroServico', uniq(this.atendimentos.map(a => a.servico)))
        setSelect('filtroTipoOcorrencia', uniq(this.atendimentos.map(a => a.tipo_ocorrencia)))
    }
    limparFiltros() {
        const campos = ['filtroDataInicio', 'filtroDataFim', 'filtroStatus', 'filtroPortfolio', 'filtroServico', 'filtroTipoOcorrencia', 'filtroSolicitante']
        campos.forEach(id => {
            const elemento = document.getElementById(id)
            if (elemento) {
                if (elemento.tagName === 'SELECT') {
                    elemento.value = elemento.querySelector('option') ? elemento.querySelector('option').value : ''
                } else {
                    elemento.value = ''
                }
            }
        })
        this.aplicarFiltros()
    }
    aplicarFiltros() {
        const di = (document.getElementById('filtroDataInicio')?.value) || ''
        const df = (document.getElementById('filtroDataFim')?.value) || ''
        const status = (document.getElementById('filtroStatus')?.value) || 'todos'
        const port = (document.getElementById('filtroPortfolio')?.value) || ''
        const serv = (document.getElementById('filtroServico')?.value) || ''
        const tipo = (document.getElementById('filtroTipoOcorrencia')?.value) || ''
        const solicitante = (document.getElementById('filtroSolicitante')?.value || '').toLowerCase()
        const parseISOorBR = (val, fimDoDia = false) => {
            if (!val) return null
            let iso = val
            if (val.includes('/')) {
                iso = DateFormatter.paraFormatoISO(val)
            }
            const dt = new Date(iso + (fimDoDia ? 'T23:59:59' : ''))
            return isNaN(dt.getTime()) ? null : dt.getTime()
        }
        const diTime = parseISOorBR(di)
        const dfTime = parseISOorBR(df, true)
        this.filtrados = this.atendimentos.filter(a => {
            const t = new Date(String(a.data_inicio).replace('Z', '')).getTime()
            if (diTime && (!t || t < diTime)) return false
            if (dfTime && (!t || t > dfTime)) return false
            if (status !== 'todos' && a.status !== status) return false
            if (port && a.portfolio !== port) return false
            if (serv && a.servico !== serv) return false
            if (tipo && a.tipo_ocorrencia !== tipo) return false
            if (solicitante && !(a.nome_solicitante || '').toLowerCase().includes(solicitante)) return false
            return true
        })
        this.renderTabelaAnalitica()
    }
    renderTabelaAnalitica() {
        this.render.renderizarTabelaAnalitica(this.filtrados)
        this.render.renderizarKPIs(this.filtrados)
    }
    limparFiltros() {
        const filtroDataInicio = document.getElementById('filtroDataInicio')
        const filtroDataFim = document.getElementById('filtroDataFim')
        const filtroStatus = document.getElementById('filtroStatus')
        const filtroPortfolio = document.getElementById('filtroPortfolio')
        const filtroServico = document.getElementById('filtroServico')
        const filtroTipoOcorrencia = document.getElementById('filtroTipoOcorrencia')
        const filtroSolicitante = document.getElementById('filtroSolicitante')

        if (filtroDataInicio) filtroDataInicio.value = ''
        if (filtroDataFim) filtroDataFim.value = ''
        if (filtroStatus) filtroStatus.value = 'todos'
        if (filtroPortfolio) filtroPortfolio.value = ''
        if (filtroServico) filtroServico.value = ''
        if (filtroTipoOcorrencia) filtroTipoOcorrencia.value = ''
        if (filtroSolicitante) filtroSolicitante.value = ''

        this.aplicarFiltros()
        this.notification.mostrarSucesso('Filtros limpos com sucesso!')
    }
    async recarregarDados() {
        await this.carregarAtendimentos()
        this.popularCombos()
        this.aplicarFiltros()
        this.notification.mostrarSucesso('Dados recarregados com sucesso!')
    }
    exportarCSV() {
        if (!this.filtrados.length) {
            UIMiddleware.mostrarMensagem('Nenhum atendimento para exportar', 'warning')
            return
        }
        let csv = 'ID,Solicitante,Data Início,Data Fim,Portfólio,Serviço,Tipo Ocorrência,Status,Descrição\n'
        const ordenados = [...this.filtrados].sort((a, b) => a.id - b.id)
        ordenados.forEach(a => {
            const linha = [
                a.id,
                `"${a.nome_solicitante || ''}"`,
                this.dateService.formatarData(a.data_inicio),
                a.data_fim ? this.dateService.formatarData(a.data_fim) : '-',
                `"${a.portfolio || ''}"`,
                `"${a.servico || ''}"`,
                `"${a.tipo_ocorrencia || ''}"`,
                a.status,
                `"${(a.descricao || '').replace(/"/g, '""')}"`
            ].join(',')
            csv += linha + '\n'
        })
        this.baixarCSV(csv)
    }
    baixarCSV(csv) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `relatorio_atendimentos_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        UIMiddleware.mostrarMensagem('Relatório exportado com sucesso!', 'success')
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const instance = new RelatoriosFrontController()
    window.relatoriosFrontController = instance
    window.RelatoriosController = instance
    window.relatoriosController = instance
})
