import { Router } from 'express'
import { AtendimentoController } from '../controller/AtendimentoController.js'
import ValidadorAutenticacao from '../middleware/autenticacao.js'
const router = Router()
router.post('/', ValidadorAutenticacao.validarToken, AtendimentoController.criar)
router.get('/', ValidadorAutenticacao.validarToken, AtendimentoController.listar)
router.get('/:id', ValidadorAutenticacao.validarToken, AtendimentoController.buscarPorId)
router.put("/:id", ValidadorAutenticacao.validarToken, AtendimentoController.atualizar)
router.delete("/:id", ValidadorAutenticacao.validarToken, AtendimentoController.deletar)
router.delete("/:id/deletar", ValidadorAutenticacao.validarToken, AtendimentoController.deletarPermanente)
export default router
