export class Usuario {
    #idTipoUsuario
    #nome
    #cpf
    #dataNascimento
    #telefone
    #cep
    #endereco
    #email
    #status
    #senha

    constructor(
        idTipoUsuario,
        nome,
        senha,
        cpf,
        dataNascimento,
        telefone,
        cep,
        endereco,
        email,
        status,
    ) {
        this.#idTipoUsuario = idTipoUsuario
        this.#nome = nome
        this.#senha = senha
        this.#cpf = cpf
        this.#dataNascimento = dataNascimento
        this.#telefone = telefone
        this.#cep = cep
        this.#endereco = endereco
        this.#email = email
        this.#status = status
    }

    get idTipoUsuario() { return this.#idTipoUsuario }
    set idTipoUsuario(v) { this.#idTipoUsuario = v }

    get nome() { return this.#nome }
    set nome(v) { this.#nome = v }

    get cpf() { return this.#cpf }
    set cpf(v) { this.#cpf = v }

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

    get status() { return this.#status }
    set status(v) { this.#status = v }

    get senha() {
        return this.#senha
    }

    set senha(novaSenha) {
        this.#senha = novaSenha
    }

    validarCPF() {
        const cpf = (this.#cpf || "").replace(/\D/g, "");

        if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++)
            soma += parseInt(cpf.charAt(i)) * (10 - i);

        let dig1 = 11 - (soma % 11);
        if (dig1 > 9) dig1 = 0;

        if (dig1 !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++)
            soma += parseInt(cpf.charAt(i)) * (11 - i);

        let dig2 = 11 - (soma % 11);
        if (dig2 > 9) dig2 = 0;

        return dig2 === parseInt(cpf.charAt(10));
    }

    toJSON() {
        return {
            id_tipo_usuario: this.#idTipoUsuario,
            nome: this.#nome,
            senha: this.#senha,
            cpf: this.#cpf,
            data_nascimento: this.#dataNascimento,
            telefone: this.#telefone,
            cep: this.#cep,
            endereco: this.#endereco,
            email: this.#email,
            status: this.#status
        };
    }
}