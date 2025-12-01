class ValidationService {
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }
    validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '')
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false
        let soma = 0
        let resto
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i)
        }
        resto = (soma * 10) % 11
        if (resto === 10 || resto === 11) resto = 0
        if (resto !== parseInt(cpf.substring(9, 10))) return false
        soma = 0
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i)
        }
        resto = (soma * 10) % 11
        if (resto === 10 || resto === 11) resto = 0
        if (resto !== parseInt(cpf.substring(10, 11))) return false
        return true
    }
    validarTelefone(telefone) {
        const telefoneNumeros = telefone.replace(/\D/g, '')
        return telefoneNumeros.length === 10 || telefoneNumeros.length === 11
    }
    validarCEP(cep) {
        const cepNumeros = cep.replace(/\D/g, '')
        return cepNumeros.length === 8
    }
    validarSenha(senha, minCaracteres = 6) {
        return senha && senha.length >= minCaracteres
    }
    validarSenhasIguais(senha, confirmarSenha) {
        return senha === confirmarSenha
    }
    validarCampoObrigatorio(valor) {
        return valor !== null && valor !== undefined && valor.toString().trim() !== ''
    }
    validarCamposObrigatorios(campos) {
        for (const campo of campos) {
            if (!this.validarCampoObrigatorio(campo)) {
                return false
            }
        }
        return true
    }
    formatarCPF(cpf) {
        if (!cpf) return ''
        cpf = cpf.replace(/\D/g, '')
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    formatarCNPJ(cnpj) {
        if (!cnpj) return ''
        cnpj = cnpj.replace(/\D/g, '')
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
    formatarCPFouCNPJ(identificacao) {
        if (!identificacao) return ''
        identificacao = identificacao.replace(/\D/g, '')
        if (identificacao.length === 11) {
            return this.formatarCPF(identificacao)
        } else if (identificacao.length === 14) {
            return this.formatarCNPJ(identificacao)
        }
        return identificacao
    }
    formatarTelefone(telefone) {
        if (!telefone) return ''
        telefone = telefone.replace(/\D/g, '')
        if (telefone.length === 11) {
            return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        } else if (telefone.length === 10) {
            return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
        }
        return telefone
    }
    formatarCEP(cep) {
        if (!cep) return ''
        cep = cep.replace(/\D/g, '')
        return cep.replace(/(\d{5})(\d{3})/, '$1-$2')
    }
}
window.ValidationService = ValidationService
