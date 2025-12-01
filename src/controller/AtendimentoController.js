import createError from "http-errors";
import conexao from "../model/Conexao.js";
import { Atendimento } from "../model/Atendimento.js";
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
            let statusNormalizado = status ?? "Em Andamento";
            if (statusNormalizado) {
                statusNormalizado = statusNormalizado
                    .replace(/_/g, ' ')
                    .split(' ')
                    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
                    .join(' ');
            }
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
                statusNormalizado,
                canal
            );
            const [id] = await conexao("atendimento").insert(atendimento.toJSON());
            res.status(201).json({ id, ...atendimento.toJSON() });
        } catch (error) {
            next(error);
        }
    }
    static async listar(req, res, next) {
        try {
            const dados = await conexao("atendimento")
                .select(
                    "atendimento.id",
                    "u.nome AS nome_atendente",
                    "tu.tipo AS cargo_atendente",
                    "sol.nome AS nome_solicitante",
                    "ts.tipo AS tipo_solicitante",
                    "p.nome AS portfolio",
                    "serv.nome AS servico",
                    "to.tipo AS tipo_ocorrencia",
                    "sol.identificacao",
                    "sol.telefone",
                    "sol.cep",
                    "atendimento.arquivos_caminho",
                    "atendimento.data_inicio",
                    "atendimento.data_fim",
                    "atendimento.solucao",
                    "atendimento.descricao",
                    "atendimento.status",
                    "atendimento.canal"
                )
                .leftJoin("solicitante AS sol", "sol.id", "=", "atendimento.id_solicitante")
                .leftJoin("tipo_solicitante AS ts", "ts.id", "=", "sol.id_tipo_solicitante")
                .leftJoin("usuario AS u", "u.id", "=", "atendimento.id_atendente")
                .leftJoin("tipo_usuario AS tu", "tu.id", "=", "u.id_tipo_usuario")
                .leftJoin("servico AS serv", "serv.id", "=", "atendimento.id_servico")
                .leftJoin("portfolio AS p", "p.id", "=", "atendimento.id_portfolio")
                .leftJoin("tipo_ocorrencia AS to", "to.id", "=", "atendimento.id_tipo_ocorrencia")
            res.status(200).json(dados)
        } catch (error) {
            next(error);
        }
    }
    static async buscarPorId(req, res, next) {
        try {
            const { id } = req.params;
            const dado = await conexao("atendimento")
                .select(
                    "atendimento.*",
                    "sol.nome AS nome_solicitante",
                    "serv.nome AS nome_servico",
                    "p.nome AS nome_portfolio",
                    "to.tipo AS nome_tipo_ocorrencia"
                )
                .leftJoin("solicitante AS sol", "sol.id", "=", "atendimento.id_solicitante")
                .leftJoin("servico AS serv", "serv.id", "=", "atendimento.id_servico")
                .leftJoin("portfolio AS p", "p.id", "=", "atendimento.id_portfolio")
                .leftJoin("tipo_ocorrencia AS to", "to.id", "=", "atendimento.id_tipo_ocorrencia")
                .where("atendimento.id", id)
                .first();
            if (!dado) throw createError(404, "Atendimento não encontrado!");
            res.json(dado);
        } catch (error) {
            next(error);
        }
    }
    static async atualizar(req, res, next) {
        try {
            const { id } = req.params;
            const existe = await conexao("atendimento").where({ id }).first();
            if (!existe) throw createError(404, "Atendimento não encontrado");
            const dadosAtualizados = { ...req.body };
            if (dadosAtualizados.status) {
                dadosAtualizados.status = dadosAtualizados.status
                    .replace(/_/g, ' ')
                    .split(' ')
                    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
                    .join(' ');
            }
            await conexao("atendimento").where({ id }).update(dadosAtualizados);
            res.json({ message: "Atendimento atualizado com sucesso!" });
        } catch (error) {
            next(error);
        }
    }
    static async deletar(req, res, next) {
        try {
            const { id } = req.params;
            const existe = await conexao("atendimento").where({ id }).first();
            if (!existe) throw createError(404, "Atendimento não encontrado!");
            await conexao("atendimento")
                .where({ id })
                .update({ status: "Finalizado" });
            res.json({ message: "Atendimento finalizado com sucesso!" });
        } catch (error) {
            next(error);
        }
    }
}
