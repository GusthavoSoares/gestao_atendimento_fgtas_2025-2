export class Solicitante {
    #idTipoSolicitante
    #nome
    #identificacao
    #dataNascimento
    #telefone
    #cep
    #endereco
    #email
    #status

    constructor(
        idTipoSolicitante,
        nome,
        identificacao,
        dataNascimento,
        telefone,
        cep,
        endereco,
        email,
        status
    ) {
        this.#idTipoSolicitante = idTipoSolicitante
        this.#nome = nome
        this.#identificacao = identificacao
        this.#dataNascimento = dataNascimento
        this.#telefone = telefone
        this.#cep = cep
        this.#endereco = endereco
        this.#email = email
        this.#status = status
    }

    get idTipoSolicitante() { return this.#idTipoSolicitante }
    set idTipoSolicitante(v) { this.#idTipoSolicitante = v }

    get nome() { return this.#nome }
    set nome(v) { this.#nome = v }

    get identificacao() { return this.#identificacao }
    set identificacao(v) { this.#identificacao = v }

    get dataNascimento() { return this.#dataNascimento }
    set dataNascimento(v) { this.#dataNascimento = v }

    get telefone() { return this.#telefone }
    set telefone(v) { this.#telefone = v }

    get cep() { return this.#cep }
    set cep(v) { this.#cep = v }

    get endereco() { return this.#endereco }
    set endereco(v) { this.#endereco = v }

    get email() { return this.#email }
    set email(v) { this.#email = v }

    get status() {
        return this.#status
    }

    set status(v) {
        this.#status = v
    }

    toJSON() {
        return {
            id_tipo_solicitante: this.#idTipoSolicitante,
            nome: this.#nome,
            identificacao: this.#identificacao,
            data_nascimento: this.#dataNascimento,
            telefone: this.#telefone,
            cep: this.#cep,
            endereco: this.#endereco,
            email: this.#email,
            status: this.#status
        }
    }
    validarIdentificacao() {
        const valor = (this.#identificacao || "").replace(/\D/g, "")

        if (valor.length === 11) {
            return this.#validarCPF(valor)
        } else if (valor.length === 14) {
            return this.#validarCNPJ(valor)
        }

        return false
    }

    #validarCPF(cpf) {
        if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

        let soma = 0
        for (let i = 0; i < 9; i++)
            soma += parseInt(cpf.charAt(i)) * (10 - i)

        let dig1 = 11 - (soma % 11)
        if (dig1 > 9) dig1 = 0

        if (dig1 !== parseInt(cpf.charAt(9))) return false

        soma = 0
        for (let i = 0; i < 10; i++)
            soma += parseInt(cpf.charAt(i)) * (11 - i)

        let dig2 = 11 - (soma % 11)
        if (dig2 > 9) dig2 = 0

        return dig2 === parseInt(cpf.charAt(10))
    }

    #validarCNPJ(cnpj) {
        if (!cnpj || cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false

        const calc = (base) => {
            let soma = 0
            let pos = base.length - 7

            for (let i = base.length; i >= 1; i--) {
                soma += parseInt(base.charAt(base.length - i)) * pos--
                if (pos < 2) pos = 9
            }

            const dig = soma % 11 < 2 ? 0 : 11 - (soma % 11)
            return dig
        }

        const base = cnpj.substring(0, 12)
        const dig1 = calc(base)
        const dig2 = calc(base + dig1)

        return (
            dig1 === parseInt(cnpj.charAt(12)) &&
            dig2 === parseInt(cnpj.charAt(13))
        )
    }
}