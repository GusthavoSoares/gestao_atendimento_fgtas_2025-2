export class TipoOcorrencia {
    #nome

    constructor(nome) {
        this.#nome = nome
    }

    get nome() {
        return this.#nome
    }

    set nome(novoNome) {
        this.#nome = novoNome
    }

    toJSON() {
        return {
            nome: this.#nome
        }
    }
}