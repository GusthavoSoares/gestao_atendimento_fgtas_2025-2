import conexao from '../model/Conexao.js'
import createError from 'http-errors'
import { Usuario } from '../model/Usuario.js'
import bcrypt from 'bcryptjs'
export class UsuarioController {
    static async criar(req, res, next) {
        try {
            const {
                id_tipo_usuario,
                nome,
                senha,
                cpf,
                data_nascimento,
                telefone,
                cep,
                endereco,
                email,
                status
            } = req.body
            const regexSenha = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
            if (!regexSenha.test(senha)) {
                throw createError(400,
                    "A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 número e 1 caractere especial."
                )
            }
            const usuario = new Usuario(
                id_tipo_usuario,
                nome,
                senha,
                cpf,
                data_nascimento,
                telefone,
                cep,
                endereco,
                email,
                status
            )
            if (!usuario.validarCPF()) {
                throw createError(400, "CPF inválido!")
            }

            // Verificar duplicação de email
            const emailExistente = await conexao('usuario')
                .where({ email })
                .first()
            if (emailExistente) {
                throw createError(409, "Este email já está cadastrado no sistema.")
            }

            // Verificar duplicação de CPF (se fornecido)
            if (cpf) {
                const cpfExistente = await conexao('usuario')
                    .where({ cpf })
                    .first()
                if (cpfExistente) {
                    throw createError(409, "Este CPF já está cadastrado no sistema.")
                }
            }

            const senhaHash = await bcrypt.hash(senha, 10)
            usuario.senha = senhaHash
            const [id] = await conexao('usuario').insert(usuario.toJSON())
            res.status(201).json({
                id,
                id_tipo_usuario,
                nome,
                cpf,
                data_nascimento,
                telefone,
                cep,
                endereco,
                email,
                status
            })
        } catch (error) {
            next(error)
        }
    }
    static async listar(req, res, next) {
        try {
            const dados = await conexao('usuario')
                .select(
                    "usuario.id",
                    "usuario.nome",
                    "tp.tipo AS tipo_usuario",
                    "usuario.cpf",
                    "usuario.data_nascimento",
                    "usuario.telefone",
                    "usuario.cep",
                    "usuario.endereco",
                    "usuario.email",
                    "usuario.status"
                )
                .innerJoin("tipo_usuario AS tp", "tp.id", "=", "usuario.id_tipo_usuario")
            res.json(dados)
        } catch (error) { next(error) }
    }
    static async buscarPorId(req, res, next) {
        try {
            const dado = await conexao('usuario')
                .select(
                    "id",
                    "id_tipo_usuario",
                    "nome",
                    "cpf",
                    "data_nascimento",
                    "telefone",
                    "cep",
                    "endereco",
                    "email",
                    "status"
                )
                .where({ id: req.params.id })
                .first()
            if (!dado) throw createError(404, 'Usuário não encontrado!')
            res.json(dado)
        } catch (error) {
            next(error)
        }
    }
    static async atualizar(req, res, next) {
        try {
            const { id } = req.params
            const existe = await conexao('usuario').where({ id }).first()
            if (!existe) {
                throw createError(404, 'Usuário não encontrado!')
            }
            if (req.body.cpf) {
                const usuarioTemp = new Usuario(
                    null,
                    null,
                    null,
                    req.body.cpf,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                )
                if (!usuarioTemp.validarCPF()) {
                    throw createError(400, "CPF inválido!")
                }
            }
            const regexSenha = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
            if (req.body.senha) {
                if (!regexSenha.test(req.body.senha)) {
                    throw createError(400,
                        "A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 número e 1 caractere especial."
                    )
                }
                req.body.senha = await bcrypt.hash(req.body.senha, 10)
            }

            // Verificar duplicação de email (excluindo o próprio usuário)
            if (req.body.email) {
                const emailExistente = await conexao('usuario')
                    .where({ email: req.body.email })
                    .whereNot({ id })
                    .first()
                if (emailExistente) {
                    throw createError(409, "Este email já está cadastrado no sistema.")
                }
            }

            // Verificar duplicação de CPF (excluindo o próprio usuário)
            if (req.body.cpf) {
                const cpfExistente = await conexao('usuario')
                    .where({ cpf: req.body.cpf })
                    .whereNot({ id })
                    .first()
                if (cpfExistente) {
                    throw createError(409, "Este CPF já está cadastrado no sistema.")
                }
            }

            await conexao('usuario').where({ id }).update(req.body)
            res.json({ message: 'Usuário atualizado com sucesso!' })
        } catch (error) {
            next(error)
        }
    }
    static async deletar(req, res, next) {
        try {
            const { id } = req.params
            const existe = await conexao('usuario').where({ id }).first()
            if (!existe) throw createError(404, 'Usuário não encontrado')
            await conexao('usuario').where({ id }).update({ status: 'Inativo' })
            res.json({ message: 'Usuário desativado com sucesso!' })
        } catch (error) { next(error) }
    }

    static async deletarPermanente(req, res, next) {
        try {
            const { id } = req.params
            const existe = await conexao('usuario').where({ id }).first()
            if (!existe) throw createError(404, 'Usuário não encontrado')
            await conexao('usuario').where({ id }).del()
            res.json({ message: 'Usuário excluído com sucesso!' })
        } catch (error) { next(error) }
    }

    static async login(req, res, next) {
        try {
            const { email, senha } = req.body
            const usuario = await conexao('usuario')
                .select(
                    'usuario.id',
                    'usuario.nome',
                    'usuario.email',
                    'usuario.senha',
                    'usuario.status',
                    'tp.tipo AS tipo_usuario'
                )
                .innerJoin('tipo_usuario AS tp', 'tp.id', '=', 'usuario.id_tipo_usuario')
                .where('usuario.email', '=', email)
                .first()
            if (!usuario) {
                throw createError(401, 'Email ou senha inválidos')
            }
            if (usuario.status === 'Inativo') {
                throw createError(403, 'Usuário desativado')
            }
            const senhaValida = await bcrypt.compare(senha, usuario.senha)
            if (!senhaValida) {
                throw createError(401, 'Email ou senha inválidos')
            }
            const token = Buffer.from(JSON.stringify({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo_usuario: usuario.tipo_usuario,
                timestamp: Date.now()
            })).toString('base64')
            res.json({
                mensagem: 'Login realizado com sucesso',
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    tipo_usuario: usuario.tipo_usuario
                }
            })
        } catch (error) {
            next(error)
        }
    }
    static async alterarSenha(req, res, next) {
        try {
            const { id } = req.params
            const { senhaAtual, novaSenha } = req.body
            if (!senhaAtual || !novaSenha) {
                throw createError(400, 'Senha atual e nova senha são obrigatórias')
            }
            const regexSenha = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
            if (!regexSenha.test(novaSenha)) {
                throw createError(400,
                    'A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 número e 1 caractere especial.'
                )
            }
            const usuario = await conexao('usuario').where({ id }).first()
            if (!usuario) {
                throw createError(404, 'Usuário não encontrado')
            }
            const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha)
            if (!senhaValida) {
                throw createError(401, 'Senha atual inválida')
            }
            const senhaHash = await bcrypt.hash(novaSenha, 10)
            await conexao('usuario').where({ id }).update({
                senha: senhaHash,
                updated_at: new Date()
            })
            res.json({
                mensagem: 'Senha alterada com sucesso',
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                }
            })
        } catch (error) {
            next(error)
        }
    }
    static async esqueciSenha(req, res, next) {
        try {
            const { email, cpf, novaSenha } = req.body
            if (!email || !cpf || !novaSenha) {
                throw createError(400, 'Email, CPF e nova senha são obrigatórios')
            }
            const regexSenha = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
            if (!regexSenha.test(novaSenha)) {
                throw createError(400,
                    'A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 número e 1 caractere especial.'
                )
            }
            const usuario = await conexao('usuario')
                .where({ email, cpf })
                .first()
            if (!usuario) {
                throw createError(404, 'Usuário não encontrado com este email e CPF')
            }
            if (usuario.status === 'Inativo') {
                throw createError(403, 'Usuário desativado. Entre em contato com o administrador.')
            }
            const senhaHash = await bcrypt.hash(novaSenha, 10)
            await conexao('usuario').where({ id: usuario.id }).update({
                senha: senhaHash,
                updated_at: new Date()
            })
            res.json({
                mensagem: 'Senha redefinida com sucesso',
                usuario: {
                    nome: usuario.nome,
                    email: usuario.email
                }
            })
        } catch (error) {
            next(error)
        }
    }
}
