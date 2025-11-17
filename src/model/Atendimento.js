export class Atendimento {
    #idSolicitante
    #idAtendente
    #idPortfolio
    #idServico
    #idTipoOcorrencia
    #arquivosCaminho
    #dataInicio
    #dataFim
    #solucao
    #descricao
    #status
    #canal


    constructor(
        idSolicitante,
        idAtendente,
        idPortfolio,
        idServico,
        idTipoOcorrencia,
        arquivosCaminho,
        dataInicio = new Date(),
        dataFim,
        solucao,
        descricao,
        status,
        canal
    ) {
        this.#idSolicitante = idSolicitante
        this.#idAtendente = idAtendente
        this.#idPortfolio = idPortfolio
        this.#idServico = idServico
        this.#idTipoOcorrencia = idTipoOcorrencia
        this.#arquivosCaminho = arquivosCaminho
        this.#dataInicio = dataInicio
        this.#dataFim = dataFim
        this.#solucao = solucao
        this.#descricao = descricao
        this.#status = status
        this.#canal = canal

    }

    get idSolicitante() { return this.#idSolicitante; }
    set idSolicitante(v) { this.#idSolicitante = v; }

    get idAtendente() { return this.#idAtendente; }
    set idAtendente(v) { this.#idAtendente = v; }

    get idPortfolio() { return this.#idPortfolio; }
    set idPortfolio(v) { this.#idPortfolio = v; }

    get idServico() { return this.#idServico; }
    set idServico(v) { this.#idServico = v; }

    get idTipoOcorrencia() { return this.#idTipoOcorrencia; }
    set idTipoOcorrencia(v) { this.#idTipoOcorrencia = v; }

    get arquivosCaminho() { return this.#arquivosCaminho; }
    set arquivosCaminho(v) { this.#arquivosCaminho = v; }

    get dataInicio() { return this.#dataInicio; }
    set dataInicio(v) { this.#dataInicio = v; }

    get dataFim() { return this.#dataFim; }
    set dataFim(v) { this.#dataFim = v; }

    get solucao() { return this.#solucao; }
    set solucao(v) { this.#solucao = v; }

    get descricao() { return this.#descricao; }
    set descricao(v) { this.#descricao = v; }

    get status() { return this.#status; }
    set status(v) { this.#status = v; }

    get canal() { return this.#canal; }
    set canal(v) { this.#canal = v; }


    toJSON() {
        return {
            id_solicitante: this.#idSolicitante,
            id_atendente: this.#idAtendente,
            id_portfolio: this.#idPortfolio,
            id_servico: this.#idServico,
            id_tipo_ocorrencia: this.#idTipoOcorrencia,
            arquivos_caminho: this.#arquivosCaminho,
            data_inicio: this.#dataInicio,
            data_fim: this.#dataFim,
            solucao: this.#solucao,
            descricao: this.#descricao,
            status: this.#status,
            canal: this.#canal
        }
    }
}