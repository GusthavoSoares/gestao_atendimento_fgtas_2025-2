import { Router } from 'express'
import { ServicoController } from '../controller/ServicoController.js'
import ValidadorAutenticacao from '../middleware/autenticacao.js'
const router = Router()
router.post('/', ValidadorAutenticacao.validarToken, ServicoController.criar)
router.get('/', ValidadorAutenticacao.validarToken, ServicoController.listar)
router.get('/:id', ValidadorAutenticacao.validarToken, ServicoController.buscarPorId)
router.put("/:id", ValidadorAutenticacao.validarToken, ServicoController.atualizar)
router.delete("/:id", ValidadorAutenticacao.validarToken, ServicoController.deletar)
router.delete("/:id/deletar", ValidadorAutenticacao.validarToken, ServicoController.deletarPermanente)
export default router
