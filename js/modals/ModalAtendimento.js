class ModalAtendimento {
    constructor(apiBaseUrl) {
        this.API_BASE_URL = apiBaseUrl
        this.solicitantes = []
        this.servicos = []
        this.portfolios = []
        this.tiposOcorrencia = []
        this._modalCriar = null
        this._modalEditar = null
        this._syncStatusInterval = null
        this.dateService = new DateService()
        this.render = new AtendimentoRender()
        this.modalService = new ModalService()
    }

    async ensureTemplates() {
        // Verifica se os modais já existem, se não, cria ambos
        const modalCriar = document.getElementById('modalCriarAtendimento')
        const modalEditar = document.getElementById('modalEditarAtendimento')

        if (!modalCriar || !modalEditar) {
            this.modalService.ensureElement('modalCriarAtendimento', () => this.render.getModalTemplates())
        }
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
            if (t.id_portfolio) option.dataset.portfolio = String(t.id_portfolio)
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
        selectPortfolio.addEventListener('change', () => {
            const escolhido = selectPortfolio.value
            this._filtrarServicosPorPortfolio(selectServico, escolhido)
        })
        if (selectPortfolio.value) {
            this._filtrarServicosPorPortfolio(selectServico, selectPortfolio.value)
        }
    }

    _filtrarServicosPorPortfolio(selectServico, idPortfolio) {
        const todasOpcoes = []
        const defaultOption = document.createElement('option')
        defaultOption.value = ''
        defaultOption.textContent = 'Selecione...'
        todasOpcoes.push(defaultOption)
        this.servicos.forEach(s => {
            if (!idPortfolio || String(s.id_portfolio) === String(idPortfolio)) {
                const option = document.createElement('option')
                option.value = s.id
                option.textContent = s.nome
                if (s.id_portfolio) option.dataset.portfolio = String(s.id_portfolio)
                todasOpcoes.push(option)
            }
        })
        selectServico.innerHTML = ''
        todasOpcoes.forEach(o => selectServico.appendChild(o))
    }

    async abrirModalCriar(onSuccess) {
        await this.ensureTemplates()
        this.preencherSelects('Criar')

        // Ocultar modal anterior se existir
        if (this._modalCriar) {
            try {
                this._modalCriar.hide()
            } catch (e) {
                console.log('Modal anterior já estava oculto')
            }
            this._modalCriar = null
        }

        this._modalCriar = this.modalService.createBootstrapModal('modalCriarAtendimento')
        if (!this._modalCriar) {
            console.error('Erro: Não foi possível criar o modal')
            return
        }

        const btn = document.getElementById('btnCriarAtendimento')
        if (btn) {
            // Remover listeners anteriores
            const newBtn = btn.cloneNode(true)
            btn.parentNode.replaceChild(newBtn, btn)
            newBtn.addEventListener('click', () => this.criar(onSuccess))
        }

        // Adicionar listeners para o botão cancelar e fechar (X)
        const cancelarBtn = this._modalCriar._element?.querySelector('[data-bs-dismiss="modal"]')
        if (cancelarBtn) {
            cancelarBtn.addEventListener('click', () => {
                this._modalCriar.hide()
                this.limparFormCriar()
            })
        }

        this._modalCriar.show()
    } async abrirModalEditar(id, onSuccess) {
        try {
            await this.ensureTemplates()
            this.preencherSelects('Edit')
            const token = localStorage.getItem('token')
            const resposta = await fetch(`${this.API_BASE_URL}/atendimentos/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!resposta.ok) throw new Error('Erro ao carregar atendimento')
            const atendimento = await resposta.json()

            const atendimentoIdEdit = document.getElementById('atendimentoIdEdit')
            const solicitanteEdit = document.getElementById('solicitanteEdit')
            const servicoEdit = document.getElementById('servicoEdit')
            const portfolioEdit = document.getElementById('portfolioEdit')
            const tipoOcorrenciaEdit = document.getElementById('tipoOcorrenciaEdit')
            const dataAtendimentoEdit = document.getElementById('dataAtendimentoEdit')
            const dataFimEl = document.getElementById('dataFimEdit')
            const descricaoEdit = document.getElementById('descricaoEdit')
            const statusEdit = document.getElementById('statusEdit')

            if (atendimentoIdEdit) atendimentoIdEdit.value = atendimento.id
            if (solicitanteEdit) solicitanteEdit.value = atendimento.id_solicitante || ''
            if (servicoEdit) servicoEdit.value = atendimento.id_servico || ''
            if (portfolioEdit) portfolioEdit.value = atendimento.id_portfolio || ''
            if (tipoOcorrenciaEdit) tipoOcorrenciaEdit.value = atendimento.id_tipo_ocorrencia || ''
            if (dataAtendimentoEdit) {
                dataAtendimentoEdit.value = this.dateService
                    ? (new DateService()).formatarDataHoraBRParaInput(atendimento.data_inicio)
                    : new DateService().formatarDataHoraBRParaInput(atendimento.data_inicio)
            }
            if (dataFimEl) {
                dataFimEl.value = atendimento.data_fim ? new DateService().formatarDataHoraBRParaInput(atendimento.data_fim) : ''
            }
            if (descricaoEdit) descricaoEdit.value = atendimento.descricao || ''
            if (statusEdit) statusEdit.value = atendimento.status || 'Em Andamento'

            // Limpar intervalo anterior se existir
            if (this._syncStatusInterval) {
                clearInterval(this._syncStatusInterval)
                this._syncStatusInterval = null
            }

            // Sincronizar status automaticamente a cada 3 segundos enquanto o modal está aberto
            const sincronizarStatus = async () => {
                try {
                    const token = localStorage.getItem('token')
                    const respAtt = await fetch(`${this.API_BASE_URL}/atendimentos/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                    if (respAtt.ok) {
                        const att = await respAtt.json()
                        if (statusEdit && att.status) {
                            statusEdit.value = att.status
                        }
                    }
                } catch (e) {
                    console.log('Erro ao sincronizar status:', e)
                }
            }
            this._syncStatusInterval = setInterval(sincronizarStatus, 3000)

            // Controlar acesso aos campos de data baseado em permissão de admin
            const ehAdmin = PermissaoAdmin.ehAdmin()
            if (dataAtendimentoEdit) {
                dataAtendimentoEdit.disabled = !ehAdmin
                dataAtendimentoEdit.addEventListener('input', () => {
                    let v = dataAtendimentoEdit.value.replace(/\D/g, '').slice(0, 12)
                    if (v.length >= 11) dataAtendimentoEdit.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4, 8)} ${v.slice(8, 10)}:${v.slice(10, 12)}`
                    else if (v.length >= 9) dataAtendimentoEdit.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4, 8)} ${v.slice(8, 10)}`
                    else if (v.length >= 5) dataAtendimentoEdit.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`
                    else if (v.length >= 3) dataAtendimentoEdit.value = `${v.slice(0, 2)}/${v.slice(2)}`
                    else dataAtendimentoEdit.value = v
                })
            }
            if (dataFimEl) {
                dataFimEl.addEventListener('input', () => {
                    let v = dataFimEl.value.replace(/\D/g, '').slice(0, 12)
                    if (v.length >= 11) dataFimEl.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4, 8)} ${v.slice(8, 10)}:${v.slice(10, 12)}`
                    else if (v.length >= 9) dataFimEl.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4, 8)} ${v.slice(8, 10)}`
                    else if (v.length >= 5) dataFimEl.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`
                    else if (v.length >= 3) dataFimEl.value = `${v.slice(0, 2)}/${v.slice(2)}`
                    else dataFimEl.value = v

                    // Se preencheu data final, mudar status para Finalizado
                    if (dataFimEl.value && dataFimEl.value.trim().length > 0 && statusEdit) {
                        statusEdit.value = 'Finalizado'
                    }
                })
            }

            // Ocultar modal anterior se existir
            if (this._modalEditar) {
                try {
                    this._modalEditar.hide()
                } catch (e) {
                    console.log('Modal anterior já estava oculto')
                }
                this._modalEditar = null
            }

            this._modalEditar = this.modalService.createBootstrapModal('modalEditarAtendimento')
            if (!this._modalEditar) {
                console.error('Erro: Não foi possível criar o modal de edição')
                return
            }

            const salvarBtn = document.getElementById('btnSalvarAtendimento')
            if (salvarBtn) {
                // Remover listeners anteriores
                const newBtn = salvarBtn.cloneNode(true)
                salvarBtn.parentNode.replaceChild(newBtn, salvarBtn)
                newBtn.addEventListener('click', () => this.salvarEdicao())
            }

            // Adicionar listeners para o botão cancelar e fechar (X)
            const cancelarBtn = this._modalEditar._element?.querySelector('[data-bs-dismiss="modal"]')
            if (cancelarBtn) {
                cancelarBtn.addEventListener('click', () => {
                    this._modalEditar.hide()
                    this.limparFormEditar()
                })
            }

            this._modalEditar.show()
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

            // Mostrar mensagem apenas no modal
            const msgEl = document.getElementById('modalCriarAtendimentoMensagem')
            if (msgEl) {
                msgEl.className = 'alert alert-success'
                msgEl.textContent = 'Atendimento criado com sucesso!'
                msgEl.style.display = 'block'
            }

            setTimeout(async () => {
                // Usar instância armazenada do modal
                if (this._modalCriar) {
                    this._modalCriar.hide()
                }
                this.limparFormCriar()
                if (typeof onSuccess === 'function') {
                    await onSuccess()
                }
            }, 1500)
        } catch (erro) {
            const msgEl = document.getElementById('modalCriarAtendimentoMensagem')
            if (msgEl) {
                msgEl.className = 'alert alert-danger'
                msgEl.textContent = erro.message || 'Erro ao criar atendimento'
                msgEl.style.display = 'block'
            }
        }
    }

    async salvarEdicao() {
        const id = document.getElementById('atendimentoIdEdit').value
        const ehAdmin = PermissaoAdmin.ehAdmin()
        const dados = {
            id_solicitante: document.getElementById('solicitanteEdit').value || null,
            id_servico: document.getElementById('servicoEdit').value || null,
            id_portfolio: document.getElementById('portfolioEdit').value || null,
            id_tipo_ocorrencia: document.getElementById('tipoOcorrenciaEdit').value || null,
            data_fim: this._parseFlexibleDate(document.getElementById('dataFimEdit').value),
            descricao: document.getElementById('descricaoEdit').value,
            status: document.getElementById('statusEdit').value
        }

        // Apenas admin pode alterar data inicial
        if (ehAdmin) {
            dados.data_inicio = this._parseFlexibleDate(document.getElementById('dataAtendimentoEdit').value)
        }

        // Se tem data_fim, automaticamente definir como Finalizado
        if (dados.data_fim && dados.data_fim !== null) {
            dados.status = 'Finalizado'
        }
        // Se Finalizado e não tem data fim, usa a data atual
        else if (dados.status === 'Finalizado' && !dados.data_fim) {
            dados.data_fim = new DateService().agoraISOBrasilia()
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
            this.modalService.showMessage('modalEditarAtendimentoMensagem', 'Atendimento atualizado com sucesso!', 'success', 1500)
            setTimeout(() => {
                if (this._modalEditar) {
                    this._modalEditar.hide()
                }
                this.limparFormEditar()
                // Recarregar os atendimentos
                if (window.atendimentoFrontController) {
                    window.atendimentoFrontController.carregarAtendimentos()
                }
            }, 1500)
        } catch (erro) {
            console.error('Erro ao atualizar atendimento:', erro)
            this.modalService.showMessage('modalEditarAtendimentoMensagem', erro.message || 'Erro ao atualizar atendimento', 'danger', 4000)
        }
    }

    limparFormCriar() {
        const form = document.getElementById('formCriarAtendimento')
        if (form) form.reset()
    }

    limparFormEditar() {
        if (this._syncStatusInterval) {
            clearInterval(this._syncStatusInterval)
            this._syncStatusInterval = null
        }
        const form = document.getElementById('formEditarAtendimento')
        if (form) form.reset()
        const msgEl = document.getElementById('modalEditarAtendimentoMensagem')
        if (msgEl) {
            msgEl.className = 'alert d-none'
            msgEl.textContent = ''
        }
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