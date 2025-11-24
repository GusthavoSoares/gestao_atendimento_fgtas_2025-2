import { Router } from 'express'

import { UsuarioController } from '../controller/UsuarioController.js'

const router = Router()

router.post('/', UsuarioController.criar)
router.get('/', UsuarioController.listar)
router.get('/inativos', UsuarioController.listarInativos)
router.get('/:id', UsuarioController.buscarPorId)
router.put("/:id", UsuarioController.atualizar)
router.delete("/:id", UsuarioController.deletar)

export default router