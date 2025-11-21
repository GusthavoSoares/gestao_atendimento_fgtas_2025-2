import conexao from '../model/Conexao.js'
import createError from 'http-errors'
import { TipoUsuario } from '../model/TipoUsuario.js'

export class TipoUsuarioController {

    static async criar(req, res, next) {
    try {
    const [id] = await conexao('tipo_usuario').insert(req.body);
    res.status(201).json({ id, ...req.body });
    } catch (error) { next(error); }
    }
    
    
    static async listar(req, res, next) {
    try {
    const dados = await conexao('tipo_usuario');
    res.json(dados);
    } catch (error) { next(error); }
    }
    
    
    static async buscarPorId(req, res, next) {
    try {
    const dado = await conexao('tipo_usuario').where({ id: req.params.id }).first();
    if (!dado) throw createError(404, 'Tipo de usuário não encontrado');
    res.json(dado);
    } catch (error) { next(error); }
    }
    
    
    static async atualizar(req, res, next) {
    try {
    const { id } = req.params;
    const existe = await conexao('tipo_usuario').where({ id }).first();
    if (!existe) throw createError(404, 'Tipo de usuário não encontrado');
    await conexao('tipo_usuario').where({ id }).update(req.body);
    res.json({ message: 'Atualizado com sucesso' });
    } catch (error) { next(error); }
    }
    
    
    static async deletar(req, res, next) {
    try {
    const { id } = req.params;
    const existe = await conexao('tipo_usuario').where({ id }).first();
    if (!existe) throw createError(404, 'Tipo de usuário não encontrado');
    await conexao('tipo_usuario').where({ id }).del();
    res.json({ message: 'Deletado com sucesso' });
    } catch (error) { next(error); }
    }
    }