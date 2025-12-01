export class TipoSolicitante {
    #tipo
    #status
    constructor(tipo,status){
        this.#tipo = tipo
        this.#status = status
    }
    get tipo(){
        return this.#tipo
    }
    get status(){
        return this.#status
    }
    toJSON(){
        return {
            tipo: this.#tipo,
            status: this.#status
        }
    }
}
