import conexao from '../model/Conexao.js'
import createError from 'http-errors'
import { Usuario } from '../model/Usuario.js'

export class UsuarioController {

    static async criar(req, res, next) {
    try {
    const [id] = await conexao('usuario').insert(req.body);
    res.status(201).json({ id, ...req.body });
    } catch (error) { next(error); }
    }
    
    
    static async listar(req, res, next) {
    try {
    const dados = await conexao('usuario');
    res.json(dados);
    } catch (error) { next(error); }
    }
    
    
    static async buscarPorId(req, res, next) {
    try {
    const dado = await conexao('usuario').where({ id: req.params.id }).first();
    if (!dado) throw createError(404, 'Usuário não encontrado');
    res.json(dado);
    } catch (error) { next(error); }
    }
    
    
    static async atualizar(req, res, next) {
    try {
    const { id } = req.params;
    const existe = await conexao('usuario').where({ id }).first();
    if (!existe) throw createError(404, 'Usuário não encontrado');
    await conexao('usuario').where({ id }).update(req.body);
    res.json({ message: 'Atualizado com sucesso' });
    } catch (error) { next(error); }
    }
    
    
    static async deletar(req, res, next) {
    try {
    const { id } = req.params;
    const existe = await conexao('usuario').where({ id }).first();
    if (!existe) throw createError(404, 'Usuário não encontrado');
    await conexao('usuario').where({ id }).update({ status: 'INATIVO' });
    res.json({ message: 'Usuário inativado com sucesso' });
    } catch (error) { next(error); }
    }
    }