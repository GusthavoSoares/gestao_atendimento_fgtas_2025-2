import conexao from '../model/Conexao.js'
import createError from 'http-errors'
import { Servico } from '../model/Servico.js'
export class ServicoController {
    static async criar(req, res, next) {
        try {
            const {
                id_portfolio,
                nome,
                status
            } = req.body
            const servico = new Servico(
                id_portfolio,
                nome,
                status
            )
            const [id] = await conexao("servico").insert(servico.toJSON())
            res.status(201).json({ id, ...servico.toJSON() })
        } catch (error) {
            next(error)
        }
    }
    static async listar(req, res, next) {
        try {
            const dados = await conexao("servico")
                .select(
                    "servico.id",
                    "servico.id_portfolio AS id_portfolio",
                    "p.nome AS portfolio",
                    "servico.nome",
                    "servico.status"
                )
                .innerJoin("portfolio AS p", "p.id", "=", "servico.id_portfolio")
            res.status(200).json(dados)
        } catch (error) {
            next(error)
        }
    }
    static async buscarPorId(req, res, next) {
        try {
            const { id } = req.params
            const dado = await conexao("servico")
                .where({ id })
                .first()
            if (!dado) throw createError(404, "Serviço não encontrado!")
            res.json(dado)
        } catch (error) {
            next(error)
        }
    }
    static async atualizar(req, res, next) {
        try {
            const { id } = req.params
            const existe = await conexao("servico").where({ id }).first()
            if (!existe) throw createError(404, "Serviço não encontrado!")
            await conexao("servico").where({ id }).update(req.body)
            res.json({ message: "Serviço atualizado com sucesso!" })
        } catch (error) {
            next(error)
        }
    }
    static async deletar(req, res, next) {
        try {
            const { id } = req.params
            const existe = await conexao("servico").where({ id }).first()
            if (!existe) throw createError(404, "Serviço não encontrado!")
            await conexao("servico")
                .where({ id })
                .update({ status: "Inativo" })
            res.json({ message: "Serviço desativado com sucesso!" })
        } catch (error) {
            next(error)
        }
    }

    static async deletarPermanente(req, res, next) {
        try {
            const { id } = req.params
            const existe = await conexao("servico").where({ id }).first()
            if (!existe) throw createError(404, "Serviço não encontrado!")
            await conexao("servico").where({ id }).del()
            res.json({ message: "Serviço excluído com sucesso!" })
        } catch (error) {
            next(error)
        }
    }
}
