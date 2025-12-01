class ModalAtendimento {
    constructor(apiBaseUrl) {
        this.API_BASE_URL = apiBaseUrl
        this.solicitantes = []
        this.servicos = []
        this.portfolios = []
        this.tiposOcorrencia = []
        this._modalCriar = null
        this._modalEditar = null
    }
    get modalCriar() {
        if (!this._modalCriar) {
            const element = document.getElementById('modalCriarAtendimento')
            if (element) {
                this._modalCriar = new bootstrap.Modal(element)
            }
        }
        return this._modalCriar
    }
    get modalEditar() {
        if (!this._modalEditar) {
            const element = document.getElementById('modalEditarAtendimento')
            if (element) {
                this._modalEditar = new bootstrap.Modal(element)
            }
        }
        return this._modalEditar
    }
    async carregarDadosSelects() {
        try {
            const token = localStorage.getItem('token')
            const [solicitantes, servicos, ocorrencias, portfolios] = await Promise.all([
                fetch(`${this.API_BASE_URL}/solicitantes`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${this.API_BASE_URL}/servicos`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${this.API_BASE_URL}/tiposOcorrencias`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${this.API_BASE_URL}/portfolios`, { headers: { 'Authorization': `Bearer ${token}` } })
            ])
            this.solicitantes = await solicitantes.json()
            this.servicos = await servicos.json()
            this.tiposOcorrencia = await ocorrencias.json()
            this.portfolios = await portfolios.json()
        } catch (erro) {
            console.error('Erro ao carregar dados dos selects:', erro)
        }
    }
    preencherSelects(sufixo) {
        const selectSolicitante = document.getElementById(`solicitante${sufixo}`)
        const selectServico = document.getElementById(`servico${sufixo}`)
        const selectOcorrencia = document.getElementById(`tipoOcorrencia${sufixo}`)
        const selectPortfolio = document.getElementById(`portfolio${sufixo}`)
        if (!selectSolicitante || !selectServico || !selectOcorrencia || !selectPortfolio) {
            return
        }
        selectSolicitante.innerHTML = '<option value="">Selecione...</option>'
        this.solicitantes.forEach(s => {
            const option = document.createElement('option')
            option.value = s.id
            option.textContent = s.nome
            selectSolicitante.appendChild(option)
        })
        selectServico.innerHTML = '<option value="">Selecione...</option>'
        this.servicos.forEach(t => {
            const option = document.createElement('option')
            option.value = t.id
            option.textContent = t.nome
            selectServico.appendChild(option)
        })
        selectOcorrencia.innerHTML = '<option value="">Selecione...</option>'
        this.tiposOcorrencia.forEach(o => {
            const option = document.createElement('option')
            option.value = o.id
            option.textContent = o.tipo
            selectOcorrencia.appendChild(option)
        })
        selectPortfolio.innerHTML = '<option value="">Selecione...</option>'
        this.portfolios.forEach(p => {
            const option = document.createElement('option')
            option.value = p.id
            option.textContent = p.nome
            selectPortfolio.appendChild(option)
        })
    }
    abrirModalCriar() {
        this.preencherSelects('Criar')
        const el = document.getElementById('dataAtendimentoCriar')
        if (el) {
            el.addEventListener('input', () => {
                let v = el.value.replace(/\D/g,'').slice(0,12)
                if (v.length >= 11) el.value = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4,8)} ${v.slice(8,10)}:${v.slice(10,12)}`
                else if (v.length >= 9) el.value = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4,8)} ${v.slice(8,10)}`
                else if (v.length >= 5) el.value = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`
                else if (v.length >= 3) el.value = `${v.slice(0,2)}/${v.slice(2)}`
                else el.value = v
            })
        }
        const hint = document.getElementById('dataAtendimentoCriar')
        if (hint) {
            hint.placeholder = 'dd/mm/aaaa hh:mm ou epoch ms'
        }
        const statusEl = document.getElementById('statusCriar')
        if (statusEl) {
            statusEl.value = 'Em Andamento'
            statusEl.setAttribute('disabled', 'disabled')
        }
        this.modalCriar.show()
    }
    async abrirModalEditar(id, onSuccess) {
        try {
            this.preencherSelects('Edit')
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/atendimentos/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!resposta.ok) throw new Error('Erro ao carregar atendimento')
            const atendimento = await resposta.json()
            document.getElementById('atendimentoIdEdit').value = atendimento.id
            document.getElementById('solicitanteEdit').value = atendimento.id_solicitante || ''
            document.getElementById('servicoEdit').value = atendimento.id_servico || ''
            document.getElementById('portfolioEdit').value = atendimento.id_portfolio || ''
            document.getElementById('tipoOcorrenciaEdit').value = atendimento.id_tipo_ocorrencia || ''
            document.getElementById('dataAtendimentoEdit').value = this.dateService
                ? (new DateService()).formatarDataHoraBRParaInput(atendimento.data_inicio)
                : new DateService().formatarDataHoraBRParaInput(atendimento.data_inicio)
            const dataFimEl = document.getElementById('dataFimEdit')
            if (dataFimEl) {
                dataFimEl.value = atendimento.data_fim ? new DateService().formatarDataHoraBRParaInput(atendimento.data_fim) : ''
            }
            document.getElementById('descricaoEdit').value = atendimento.descricao || ''
            document.getElementById('statusEdit').value = atendimento.status || 'Em Andamento'
            const el = document.getElementById('dataAtendimentoEdit')
            if (el) {
                el.addEventListener('input', () => {
                    let v = el.value.replace(/\D/g,'').slice(0,12)
                    if (v.length >= 11) el.value = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4,8)} ${v.slice(8,10)}:${v.slice(10,12)}`
                    else if (v.length >= 9) el.value = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4,8)} ${v.slice(8,10)}`
                    else if (v.length >= 5) el.value = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`
                    else if (v.length >= 3) el.value = `${v.slice(0,2)}/${v.slice(2)}`
                    else el.value = v
                })
            }
            this.modalEditar.show()
        } catch (erro) {
            if (onSuccess && onSuccess.onError) {
                onSuccess.onError(erro.message)
            }
        }
    }
    async criar(onSuccess) {
        const dados = {
            id_solicitante: document.getElementById('solicitanteCriar').value || null,
            id_servico: document.getElementById('servicoCriar').value || null,
            id_portfolio: document.getElementById('portfolioCriar').value || null,
            id_tipo_ocorrencia: document.getElementById('tipoOcorrenciaCriar').value || null,
            data_inicio: this._parseFlexibleDate(document.getElementById('dataAtendimentoCriar').value),
            descricao: document.getElementById('descricaoCriar').value,
            status: 'Em Andamento',
            id_atendente: JSON.parse(localStorage.getItem('usuario')).id
        }
        try {
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/atendimentos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dados)
            })
            if (!resposta.ok) {
                const erro = await resposta.json()
                throw new Error(erro.erro || 'Erro ao criar atendimento')
            }
            this.modalCriar.hide()
            this.limparFormCriar()
            if (typeof onSuccess === 'function') {
                await onSuccess('Atendimento criado com sucesso!')
            }
        } catch (erro) {
            if (typeof onSuccess === 'object' && onSuccess.onError) {
                onSuccess.onError(erro.message)
            } else {
                console.error('Erro ao criar atendimento:', erro)
            }
        }
    }
    async salvarEdicao(onSuccess) {
        const id = document.getElementById('atendimentoIdEdit').value
        const dados = {
            id_solicitante: document.getElementById('solicitanteEdit').value || null,
            id_servico: document.getElementById('servicoEdit').value || null,
            id_portfolio: document.getElementById('portfolioEdit').value || null,
            id_tipo_ocorrencia: document.getElementById('tipoOcorrenciaEdit').value || null,
            data_inicio: this._parseFlexibleDate(document.getElementById('dataAtendimentoEdit').value),
            data_fim: this._parseFlexibleDate(document.getElementById('dataFimEdit').value),
            descricao: document.getElementById('descricaoEdit').value,
            status: document.getElementById('statusEdit').value
        }
        // Se o status for Finalizado e data_fim não informada, definir automaticamente para agora
        if (dados.status === 'Finalizado' && !dados.data_fim) {
            dados.data_fim = new DateService().agoraISOBrasilia()
        }
        // Se reaberto (Em Andamento), garantir remoção da data_fim
        if (dados.status === 'Em Andamento') {
            dados.data_fim = null
        }
        try {
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/atendimentos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dados)
            })
            if (!resposta.ok) {
                const erro = await resposta.json()
                throw new Error(erro.erro || 'Erro ao atualizar atendimento')
            }
            this.modalEditar.hide()
            if (typeof onSuccess === 'function') {
                await onSuccess('Atendimento atualizado com sucesso!')
            }
        } catch (erro) {
            if (typeof onSuccess === 'object' && onSuccess.onError) {
                onSuccess.onError(erro.message)
            } else {
                console.error('Erro ao atualizar atendimento:', erro)
            }
        }
    }
    limparFormCriar() {
        document.getElementById('formCriarAtendimento').reset()
    }
    formatarDataLocal(dataStr) {
        return new DateService().formatarDataHoraBRParaInput(dataStr)
    }
    _parseFlexibleDate(val) {
        if (!val) return null
        const trimmed = String(val).trim()
        if (/^\d{10,}$/.test(trimmed)) {
            const d = new Date(Number(trimmed))
            return isNaN(d.getTime()) ? null : d.toISOString()
        }
        if (trimmed.includes('/')) {
            return new DateService().parseDataHoraBRParaISO(trimmed)
        }
        const d2 = new Date(trimmed)
        return isNaN(d2.getTime()) ? null : d2.toISOString()
    }
}
window.ModalAtendimento = ModalAtendimento
