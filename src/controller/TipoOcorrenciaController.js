import conexao from '../model/Conexao.js'
import createError from 'http-errors'
import { TipoOcorrencia } from '../model/TipoOcorrencia.js'
export class TipoOcorrenciaController {
    static async criar(req, res, next) {
        try {
            const {
                tipo
            } = req.body
            const tipoOcorrencia = new TipoOcorrencia(tipo)
            const [id] = await conexao('tipo_ocorrencia').insert(tipoOcorrencia.toJSON())
            res.status(201).json({ id, ...tipoOcorrencia.toJSON() })
        } catch (error) { next(error) }
    }
    static async listar(req, res, next) {
        try {
            const dados = await conexao('tipo_ocorrencia')
                .select("*")
            res.status(200).json(dados)
        } catch (error) {
            next(error)
        }
    }
    static async buscarPorId(req, res, next) {
        try {
            const dado = await conexao('tipo_ocorrencia').where({ id: req.params.id }).first()
            if (!dado) throw createError(404, 'Tipo de ocorrência não encontrada!')
            res.json(dado)
        } catch (error) {
            next(error)
        }
    }
    static async atualizar(req, res, next) {
        try {
            const { id } = req.params
            const existe = await conexao('tipo_ocorrencia').where({ id }).first()
            if (!existe) throw createError(404, 'Tipo de ocorrência não encontrada!')
            await conexao('tipo_ocorrencia').where({ id }).update(req.body)
            res.json({ message: 'Tipo de ocorrência atualizada com sucesso!' })
        } catch (error) {
            next(error)
        }
    }
    static async deletar(req, res, next) {
        try {
            const { id } = req.params
            const existe = await conexao('tipo_ocorrencia').where({ id }).first()
            if (!existe) throw createError(404, 'Tipo de ocorrência não encontrada!')
            await conexao('tipo_ocorrencia').where({ id }).del()
            res.json({ message: 'Tipo de ocorrência deletada com sucesso!' })
        } catch (error) {
            next(error)
        }
    }

    static async deletarPermanente(req, res, next) {
        try {
            const { id } = req.params
            const existe = await conexao('tipo_ocorrencia').where({ id }).first()
            if (!existe) throw createError(404, 'Tipo de ocorrência não encontrada!')
            await conexao('tipo_ocorrencia').where({ id }).del()
            res.json({ message: 'Tipo de ocorrência excluída com sucesso!' })
        } catch (error) {
            next(error)
        }
    }
}
