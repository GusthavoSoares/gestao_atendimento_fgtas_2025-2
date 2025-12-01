import { Router } from 'express'
import { UsuarioController } from '../controller/UsuarioController.js'
import ValidadorAutenticacao from '../middleware/autenticacao.js'
const router = Router()
router.post('/auth/login', ValidadorAutenticacao.validarLogin, UsuarioController.login)
router.post('/esqueci-senha', UsuarioController.esqueciSenha)
router.post('/:id/alterar-senha', ValidadorAutenticacao.validarToken, UsuarioController.alterarSenha)
router.post('/', ValidadorAutenticacao.validarToken, UsuarioController.criar)
router.get('/', ValidadorAutenticacao.validarToken, UsuarioController.listar)
router.get('/:id', ValidadorAutenticacao.validarToken, UsuarioController.buscarPorId)
router.put("/:id", ValidadorAutenticacao.validarToken, UsuarioController.atualizar)
router.delete("/:id", ValidadorAutenticacao.validarToken, UsuarioController.deletar)
export default router
