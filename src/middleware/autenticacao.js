import createError from 'http-errors'
class ValidadorAutenticacao {
    static validarLogin(req, res, next) {
        const { email, senha } = req.body
        if (!email || !senha) {
            return next(createError(400, 'Email e senha são obrigatórios'))
        }
        next()
    }
    static validarToken(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return next(createError(401, 'Token não fornecido'))
        }
        try {
            const dadosToken = JSON.parse(Buffer.from(token, 'base64').toString())
            req.usuario = dadosToken
            next()
        } catch (error) {
            next(createError(401, 'Token inválido'))
        }
    }
    static validarForcaSenha(senha) {
        const regexSenha = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
        return regexSenha.test(senha)
    }
    static validarFormatoEmail(email) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regexEmail.test(email)
    }
}
export default ValidadorAutenticacao
