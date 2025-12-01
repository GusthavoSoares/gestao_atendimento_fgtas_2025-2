import conexao from '../model/Conexao.js'
import createError from 'http-errors'
import { Solicitante } from '../model/Solicitante.js'
export class SolicitanteController {
    static async criar(req, res, next) {
        try {
            const {
                id_tipo_solicitante,
                nome,
                identificacao,
                data_nascimento,
                telefone,
                cep,
                endereco,
                email,
                status
            } = req.body
            const solicitante = new Solicitante(
                id_tipo_solicitante,
                nome,
                identificacao,
                data_nascimento,
                telefone,
                cep,
                endereco,
                email,
                status
            )
            if (!solicitante.validarIdentificacao()) {
                throw createError(400, "CPF/CNPJ inválido!")
            }
            const [id] = await conexao("solicitante").insert(solicitante.toJSON())
            res.status(201).json({ id, ...solicitante.toJSON() })
        } catch (error) {
            next(error)
        }
    }
    static async listar(req, res, next) {
        try {
            const dados = await conexao("solicitante")
                .select(
                    "solicitante.id",
                    "tp.tipo AS tipo_solicitante",
                    "solicitante.nome",
                    "solicitante.identificacao",
                    "solicitante.data_nascimento",
                    "solicitante.telefone",
                    "solicitante.cep",
                    "solicitante.endereco",
                    "solicitante.email",
                    "solicitante.status")
                .innerJoin("tipo_solicitante AS tp", "tp.id", "=", "solicitante.id_tipo_solicitante")
            res.status(200).json(dados)
        } catch (error) {
            next(error)
        }
    }
    static async buscarPorId(req, res, next) {
        try {
            const { id } = req.params
            const dado = await conexao("solicitante")
                .where({ id })
                .first()
            if (!dado) throw createError(404, "Solicitante não encontrado!")
            res.json(dado)
        } catch (error) {
            next(error)
        }
    }
    static async atualizar(req, res, next) {
        try {
            const { id } = req.params
            const existe = await conexao("solicitante").where({ id }).first()
            if (!existe) {
                throw createError(404, "Solicitante não encontrado!")
            }
            if (req.body.identificacao) {
                const solicitante = new Solicitante(
                    req.body.id_tipo_solicitante ?? existe.id_tipo_solicitante,
                    req.body.nome ?? existe.nome,
                    req.body.identificacao,
                    req.body.data_nascimento ?? existe.data_nascimento,
                    req.body.telefone ?? existe.telefone,
                    req.body.cep ?? existe.cep,
                    req.body.endereco ?? existe.endereco,
                    req.body.email ?? existe.email,
                    req.body.status ?? existe.status
                )
                if (!solicitante.validarIdentificacao()) {
                    throw createError(400, "CPF/CNPJ inválido!")
                }
            }
            await conexao("solicitante").where({ id }).update(req.body)
            res.json({ message: "Solicitante atualizado com sucesso!" })
        } catch (error) {
            next(error)
        }
    }
    static async deletar(req, res, next) {
        try {
            const { id } = req.params
            const existe = await conexao("solicitante").where({ id }).first()
            if (!existe) throw createError(404, "Serviço não encontrado!")
            await conexao("solicitante")
                .where({ id })
                .update({ status: "Inativo" })
            res.json({ message: "Solicitante desativado com sucesso!" })
        } catch (error) {
            next(error)
        }
    }
}
