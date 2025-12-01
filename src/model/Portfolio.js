export class Portfolio {
    #idTipoSolicitante
    #nome
    #status
    constructor(idTipoSolicitante,
        nome,
        status = 'ATIVO'
    ) {
        this.#idTipoSolicitante = idTipoSolicitante
        this.#nome = nome
        this.#status = status
    }
    get idTipoSolicitante() {
        return this.#idTipoSolicitante
    }
    set idTipoSolicitante(novoIdTipoSolicitante) {
        this.#idTipoSolicitante = novoIdTipoSolicitante
    }
    get nome() {
        this.#nome
    }
    set nome(novoNome) {
        this.#nome = novoNome
    }
    set status(novoStatus) {
        this.#status = novoStatus
    }
    toJSON() {
        return {
            id_tipo_solicitante: this.#idTipoSolicitante,
            nome: this.#nome,
            status: this.#status
        }
    }
}
