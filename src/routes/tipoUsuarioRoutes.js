import { Router } from 'express'
import { TipoUsuarioController } from '../controller/TipoUsuarioController.js'
import ValidadorAutenticacao from '../middleware/autenticacao.js'
const router = Router()
router.post('/', ValidadorAutenticacao.validarToken, TipoUsuarioController.criar)
router.get('/', ValidadorAutenticacao.validarToken, TipoUsuarioController.listar)
router.get('/:id', ValidadorAutenticacao.validarToken, TipoUsuarioController.buscarPorId)
router.put("/:id", ValidadorAutenticacao.validarToken, TipoUsuarioController.atualizar)
router.delete("/:id", ValidadorAutenticacao.validarToken, TipoUsuarioController.deletar)
export default router
