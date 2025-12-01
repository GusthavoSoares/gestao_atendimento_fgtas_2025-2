import createError from 'http-errors'
class ProtetorRota {
    static protegerRota(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return next(createError(401, 'Token não fornecido. Faça login primeiro.'))
        }
        try {
            const dadosToken = JSON.parse(Buffer.from(token, 'base64').toString())
            const agora = Date.now()
            const tokenAge = agora - dadosToken.timestamp
            const maxAge = 24 * 60 * 60 * 1000
            if (tokenAge > maxAge) {
                return next(createError(401, 'Token expirado'))
            }
            req.usuario = dadosToken
            next()
        } catch (error) {
            next(createError(401, 'Token inválido'))
        }
    }
    static verificarTipoUsuario(tiposPermitidos) {
        return (req, res, next) => {
            if (!req.usuario) {
                return next(createError(401, 'Usuário não autenticado'))
            }
            if (!tiposPermitidos.includes(req.usuario.tipo_usuario)) {
                return next(createError(403, 'Acesso negado. Tipo de usuário não permitido.'))
            }
            next()
        }
    }
    static logarRequisicao(req, res, next) {
        const dataAgora = new Date().toLocaleString('pt-BR')
        console.log(`[${dataAgora}] ${req.method} ${req.path} - IP: ${req.ip}`)
        next()
    }
}
export default ProtetorRota
