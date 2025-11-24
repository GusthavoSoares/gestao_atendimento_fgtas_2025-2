import { Router } from 'express'

import { TipoUsuarioController } from '../controller/TipoUsuarioController.js'

const router = Router()

router.post('/', TipoUsuarioController.criar)
router.get('/', TipoUsuarioController.listar)
router.get('/inativos', TipoUsuarioController.listarInativos)
router.get('/:id', TipoUsuarioController.buscarPorId)
router.put("/:id", TipoUsuarioController.atualizar)
router.delete("/:id", TipoUsuarioController.deletar)

export default router