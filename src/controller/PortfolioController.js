import conexao from '../model/Conexao.js'
import createError from 'http-errors'
import { Portfolio } from '../model/Portfolio.js'
export class PortfolioController {
    static async criar(req, res, next) {
        try {
            const {
                id_tipo_solicitante,
                nome,
                status
            } = req.body
            const portfolio = new Portfolio(
                id_tipo_solicitante,
                nome,
                status
            )
            const [id] = await conexao("portfolio").insert(portfolio.toJSON())
            res.status(201).json({ id, ...portfolio.toJSON() })
        } catch (error) {
            next(error)
        }
    }
    static async listar(req, res, next) {
        try {
            const dados = await conexao("portfolio")
                .select(
                    "portfolio.id",
                    "portfolio.nome",
                    "portfolio.status",
                    "ts.tipo AS tipo_solicitante")
                .innerJoin("tipo_solicitante AS ts", "ts.id", "=", "portfolio.id_tipo_solicitante")
            res.status(200).json(dados)
        } catch (error) {
            next(error)
        }
    }
    static async buscarPorId(req, res, next) {
        try {
            const { id } = req.params
            const dado = await conexao("portfolio")
                .where({ id })
                .first()
            if (!dado) throw createError(404, "Portfólio não encontrado!")
            res.json(dado)
        } catch (error) {
            next(error)
        }
    }
    static async atualizar(req, res, next) {
        try {
            const { id } = req.params
            const existe = await conexao("portfolio").where({ id }).first()
            if (!existe) throw createError(404, "Portfólio não encontrado!")
            await conexao("portfolio").where({ id }).update(req.body)
            res.json({ message: "Portfólio atualizado com sucesso!" })
        } catch (error) {
            next(error)
        }
    }
    static async deletar(req, res, next) {
        try {
            const { id } = req.params
            const existe = await conexao("portfolio").where({ id }).first()
            if (!existe) throw createError(404, "Portfólio não encontrado!")
            await conexao("portfolio")
                .where({ id })
                .update({ status: "Inativo" })
            res.json({ message: "Portfólio desativado com sucesso!" })
        } catch (error) {
            next(error)
        }
    }
}
