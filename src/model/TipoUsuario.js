export class TipoUsuario {
    #tipo
    #status

    constructor(tipo, status = 'ATIVO') {
        this.#tipo = tipo
        this.#status = status
    }

    get tipo() {
        return this.#tipo
    }

    set tipo(novoTipo) {
        this.#tipo = novoTipo
    }

    get status() {
        return this.#status
    }

    set status(novoStatus) {
        this.#status = novoStatus
    }

    toJSON() {
        return {
            tipo: this.#tipo,
            status: this.#status
        }
    }
}