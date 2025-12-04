import { Router } from 'express'
import { TipoOcorrenciaController } from '../controller/TipoOcorrenciaController.js'
import ValidadorAutenticacao from '../middleware/autenticacao.js'
const router = Router()
router.post('/', ValidadorAutenticacao.validarToken, TipoOcorrenciaController.criar)
router.get('/', ValidadorAutenticacao.validarToken, TipoOcorrenciaController.listar)
router.get('/:id', ValidadorAutenticacao.validarToken, TipoOcorrenciaController.buscarPorId)
router.put("/:id", ValidadorAutenticacao.validarToken, TipoOcorrenciaController.atualizar)
router.delete("/:id", ValidadorAutenticacao.validarToken, TipoOcorrenciaController.deletar)
router.delete("/:id/deletar", ValidadorAutenticacao.validarToken, TipoOcorrenciaController.deletarPermanente)
export default router
