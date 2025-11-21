import createError from 'http-errors';
import conexao from '../model/Conexao.js';
import { Atendimento } from '../model/Atendimento.js';

export class AtendimentoController {

    static async criar(req, res, next) {
        try {
            const {
                id_solicitante,
                id_atendente,
                id_portfolio,
                id_servico,
                id_tipo_ocorrencia,
                arquivos_caminho,
                data_inicio,
                data_fim,
                solucao,
                descricao,
                status,
                canal
            } = req.body;

            const atendimento = new Atendimento(
                id_solicitante,
                id_atendente,
                id_portfolio,
                id_servico,
                id_tipo_ocorrencia,
                arquivos_caminho,
                data_inicio ?? new Date(),
                data_fim,
                solucao,
                descricao,
                status ?? 'ATIVO',
                canal
            );

            const [id] = await conexao('atendimento').insert(atendimento.toJSON());

            res.status(201).json({ id, ...atendimento.toJSON() });

        } catch (error) {
            next(error);
        }
    }

    static async listar(req, res, next) {
        try {
            const dados = await conexao('atendimento')
            .select('atendimento.id',
                'u.nome AS nome_atendente',
                'tu.tipo AS cargo_atendente',
                'sol.nome AS nome_solicitante',
                'ts.tipo AS tipo_solicitante',
                'p.nome AS portfolio',
                'serv.nome AS servico',
                'sol.identificacao',
                'sol.telefone',
                'sol.cep',
                'atendimento.arquivos_caminho',
                 'atendimento.data_inicio',
                 'atendimento.data_fim', 
                 'atendimento.solucao', 
                 'atendimento.descricao', 
                 'atendimento.status', 
                 'atendimento.canal')
                .innerJoin("solicitante AS sol", "sol.id", "=", "atendimento.id_solicitante")
                .innerJoin("tipo_solicitante AS ts", "ts.id", "=", "sol.id_tipo_solicitante")
                .innerJoin("usuario AS u", "u.id", '=', 'atendimento.id_atendente')
                .innerJoin("tipo_usuario AS tu", "tu.id", "=", "u.id_tipo_usuario")
                .innerJoin("servico AS serv", "serv.id", "=", "atendimento.id_servico")
                .innerJoin("portfolio AS p", "p.id", "=", "atendimento.id_portfolio")
                .innerJoin("tipo_ocorrencia AS to", "to.id", "=", "atendimento.id_tipo_ocorrencia")
                .select('atendimento.id',
                    'u.nome AS nome_atendente',
                    'tu.tipo AS cargo_atendente',
                    'sol.nome AS nome_solicitante',
                    'ts.tipo AS tipo_solicitante',
                    'p.nome AS portfolio',
                    'serv.nome AS servico',
                    'sol.identificacao',
                    'sol.telefone',
                    'sol.cep',
                    'atendimento.arquivos_caminho', 'atendimento.data_inicio', 'atendimento.data_fim', 'atendimento.solucao', 'atendimento.descricao', 'atendimento.status', 'atendimento.canal')
                    .orderBy("atendimento.id", "desc")
            res.status(200).json(dados)
        } catch (error) {
            next(error);
        }
    }


    static async listarAbertos(req, res, next) {
        try {
            const dados = await conexao('atendimento')
            .select('atendimento.id',
                'u.nome AS nome_atendente',
                'tu.tipo AS cargo_atendente',
                'sol.nome AS nome_solicitante',
                'ts.tipo AS tipo_solicitante',
                'p.nome AS portfolio',
                'serv.nome AS servico',
                'sol.identificacao',
                'sol.telefone',
                'sol.cep',
                'atendimento.arquivos_caminho',
                 'atendimento.data_inicio',
                 'atendimento.data_fim', 
                 'atendimento.solucao', 
                 'atendimento.descricao', 
                 'atendimento.status', 
                 'atendimento.canal')
                .innerJoin("solicitante AS sol", "sol.id", "=", "atendimento.id_solicitante")
                .innerJoin("tipo_solicitante AS ts", "ts.id", "=", "sol.id_tipo_solicitante")
                .innerJoin("usuario AS u", "u.id", '=', 'atendimento.id_atendente')
                .innerJoin("tipo_usuario AS tu", "tu.id", "=", "u.id_tipo_usuario")
                .innerJoin("servico AS serv", "serv.id", "=", "atendimento.id_servico")
                .innerJoin("portfolio AS p", "p.id", "=", "atendimento.id_portfolio")
                .innerJoin("tipo_ocorrencia AS to", "to.id", "=", "atendimento.id_tipo_ocorrencia")
                .where('atendimento.status','=', 'Em Andamento')
                .orderBy("atendimento.id", "desc")

            res.json(dados)
        } catch (error) {
            next(error);
        }
    }

    static async listarFechados(req, res, next) {
        try {
            const dados = await conexao('atendimento')
            .select('atendimento.id',
                'u.nome AS nome_atendente',
                'tu.tipo AS cargo_atendente',
                'sol.nome AS nome_solicitante',
                'ts.tipo AS tipo_solicitante',
                'p.nome AS portfolio',
                'serv.nome AS servico',
                'sol.identificacao',
                'sol.telefone',
                'sol.cep',
                'atendimento.arquivos_caminho',
                 'atendimento.data_inicio',
                 'atendimento.data_fim', 
                 'atendimento.solucao', 
                 'atendimento.descricao', 
                 'atendimento.status', 
                 'atendimento.canal')
                .innerJoin("solicitante AS sol", "sol.id", "=", "atendimento.id_solicitante")
                .innerJoin("tipo_solicitante AS ts", "ts.id", "=", "sol.id_tipo_solicitante")
                .innerJoin("usuario AS u", "u.id", '=', 'atendimento.id_atendente')
                .innerJoin("tipo_usuario AS tu", "tu.id", "=", "u.id_tipo_usuario")
                .innerJoin("servico AS serv", "serv.id", "=", "atendimento.id_servico")
                .innerJoin("portfolio AS p", "p.id", "=", "atendimento.id_portfolio")
                .innerJoin("tipo_ocorrencia AS to", "to.id", "=", "atendimento.id_tipo_ocorrencia")
                     .where('atendimento.status','=', 'Fechado')
                    .orderBy("atendimento.id", "desc")

            res.json(dados)
        } catch (error) {
            next(error);
        }
    }

    static async buscarPorId(req, res, next) {
        try {
            const { id } = req.params;

            const dado = await conexao('atendimento')
                .where({ id })
                .first();

            if (!dado) throw createError(404, 'Atendimento não encontrado');

            res.json(dado);
        } catch (error) {
            next(error);
        }
    }

    static async atualizar(req, res, next) {
        try {
            const { id } = req.params;

            const existe = await conexao('atendimento').where({ id }).first();
            if (!existe) throw createError(404, 'Atendimento não encontrado');

            await conexao('atendimento').where({ id }).update(req.body);

            res.json({ message: 'Atendimento atualizado com sucesso' });
        } catch (error) {
            next(error);
        }
    }

    static async deletar(req, res, next) {
        try {
            const { id } = req.params;

            const existe = await conexao('atendimento').where({ id }).first();
            if (!existe) throw createError(404, 'Atendimento não encontrado');

            await conexao('atendimento')
                .where({ id })
                .update({ status: 'Finalizado' });

            res.json({ message: 'Atendimento finalizado com sucesso' });
        } catch (error) {
            next(error);
        }
    }
}
