import conexao from '../model/Conexao.js'
import createError from 'http-errors'
import { Usuario } from '../model/Usuario.js'

export class UsuarioController {

    static async criar(req, res, next) {
        try {
            const {
                id_tipo_usuario,
                nome,
                cpf,
                data_nascimento,
                telefone,
                cep,
                endereco,
                email,
                status
            } = req.body

            const usuario = new Usuario(
                id_tipo_usuario,
                nome,
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

            const [id] = await conexao('usuario').insert(usuario.toJSON())

            res.status(201).json({ id, ...req.body })

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
                    "usuario.status",
                ).innerJoin(
                    "tipo_usuario AS tp", "tp.id", "=", "usuario.id_tipo_usuario"
                )
                .where("usuario.status", "<>", "Inativo")


            res.json(dados)
        } catch (error) { next(error) }
    }

    static async listarInativos(req, res, next) {
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
                    "usuario.status",
                ).innerJoin(
                    "tipo_usuario AS tp", "tp.id", "=", "usuario.id_tipo_usuario"
                )
                .where("usuario.status", "=", "Inativo")


            res.status(200).json(dados)
        } catch (error) {
            next(error)
        }
    }


    static async buscarPorId(req, res, next) {
        try {

            const dado = await conexao('usuario').where({ id: req.params.id }).first()

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


}