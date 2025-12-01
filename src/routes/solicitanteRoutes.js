import { Router } from 'express'
import { SolicitanteController } from '../controller/SolicitanteController.js'
import ValidadorAutenticacao from '../middleware/autenticacao.js'
const router = Router()
router.post('/', ValidadorAutenticacao.validarToken, SolicitanteController.criar)
router.get('/', ValidadorAutenticacao.validarToken, SolicitanteController.listar)
router.get('/:id', ValidadorAutenticacao.validarToken, SolicitanteController.buscarPorId)
router.put("/:id", ValidadorAutenticacao.validarToken, SolicitanteController.atualizar)
router.delete("/:id", ValidadorAutenticacao.validarToken, SolicitanteController.deletar)
export default router
