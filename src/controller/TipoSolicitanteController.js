import conexao from '../model/Conexao.js'
import createError from 'http-errors'
import { TipoSolicitante } from '../model/TipoSolicitante.js'

export class TipoSolicitanteController {


    static async criar(req, res, next) {
    try {
    const {
        tipo,
        status
    } = req.body

    const tipoSolicitante = new TipoSolicitante(tipo, status)

    const [id] = await conexao('tipo_solicitante').insert(tipoSolicitante.toJSON());
    res.status(201).json({ id, ...tipoSolicitante.toJSON() });
    } catch (error) { next(error); }
    }
    
    
    static async listar(req, res, next) {
    try {
    const dados = await conexao('tipo_solicitante')
    .select("*")
    .orderBy("id", "desc");

    res.status(200).json(dados)
    } catch (error) { next(error); }
    }
    
    
    static async buscarPorId(req, res, next) {
    try {
    const dado = await conexao('tipo_solicitante').where({ id: req.params.id }).first();
    if (!dado) throw createError(404, 'Tipo solicitante não encontrado');
    res.json(dado);
    } catch (error) { next(error); }
    }
    
    
    static async atualizar(req, res, next) {
    try {
    const { id } = req.params;
    const existe = await conexao('tipo_solicitante').where({ id }).first();
    if (!existe) throw createError(404, 'Tipo solicitante não encontrado');
    await conexao('tipo_solicitante').where({ id }).update(req.body);
    res.json({ message: 'Tipo de solicitante atualizado com sucesso' });
    } catch (error) { next(error); }
    }
    
    
    static async deletar(req, res, next) {
    try {
    const { id } = req.params;
    const existe = await conexao('tipo_solicitante').where({ id }).first();
    if (!existe) throw createError(404, 'Tipo solicitante não encontrado');
    
    await conexao('tipo_solicitante').where({ id }).update({
        status:"INATIVO"
    });
    res.json({ message: 'Tipo de solicitante desativado com sucesso!'});
    } catch (error) { next(error); }
    }
    }