import { Router } from 'express'
import { TipoSolicitanteController } from '../controller/TipoSolicitanteController.js'
import ValidadorAutenticacao from '../middleware/autenticacao.js'
const router = Router()
router.post('/', ValidadorAutenticacao.validarToken, TipoSolicitanteController.criar)
router.get('/', ValidadorAutenticacao.validarToken, TipoSolicitanteController.listar)
router.get('/:id', ValidadorAutenticacao.validarToken, TipoSolicitanteController.buscarPorId)
router.put("/:id", ValidadorAutenticacao.validarToken, TipoSolicitanteController.atualizar)
router.delete("/:id", ValidadorAutenticacao.validarToken, TipoSolicitanteController.deletar)
router.delete("/:id/deletar", ValidadorAutenticacao.validarToken, TipoSolicitanteController.deletarPermanente)
export default router
