export class Servico {
    #idPortfolio
    #nome
    #status

    constructor(idPortfolio, nome, status) {
        this.#idPortfolio = idPortfolio
        this.#nome = nome
        this.#status = status
    }

    get idPortfolio() {
        return this.#idPortfolio
    }
    set idPortfolio(novoPortfolio) {
        this.#idPortfolio = novoPortfolio
    }

    get nome() {
        return this.#nome
    }

    set nome(novoNome) {
        this.#nome = novoNome
    }

    get status() {
        return this.#status
    }

    set status(novoStatus) {
        this.#status = novoStatus
    }

    toJSON() {
        return {
            id_portfolio: this.#idPortfolio,
            nome: this.#nome,
            status: this.#status
        }
    }
}