export class TipoOcorrencia {
    #tipo
    constructor(tipo) {
        this.#tipo = tipo
    }
    get tipo() {
        return this.#tipo
    }
    set tipo(novoNome) {
        this.#tipo = novoNome
    }
    toJSON() {
        return {
            tipo: this.#tipo
        }
    }
}
