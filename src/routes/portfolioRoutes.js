import { Router } from 'express'
import { PortfolioController } from '../controller/PortfolioController.js'
import ValidadorAutenticacao from '../middleware/autenticacao.js'
const router = Router()
router.post('/', ValidadorAutenticacao.validarToken, PortfolioController.criar)
router.get('/', ValidadorAutenticacao.validarToken, PortfolioController.listar)
router.get('/:id', ValidadorAutenticacao.validarToken, PortfolioController.buscarPorId)
router.put("/:id", ValidadorAutenticacao.validarToken, PortfolioController.atualizar)
router.delete("/:id", ValidadorAutenticacao.validarToken, PortfolioController.deletar)
router.delete("/:id/deletar", ValidadorAutenticacao.validarToken, PortfolioController.deletarPermanente)
export default router
