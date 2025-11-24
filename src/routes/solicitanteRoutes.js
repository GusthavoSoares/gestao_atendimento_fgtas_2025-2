import { Router } from 'express'

import { SolicitanteController } from '../controller/SolicitanteController.js'

const router = Router()

router.post('/', SolicitanteController.criar)
router.get('/', SolicitanteController.listar)
router.get('/inativos', SolicitanteController.listarInativos)
router.get('/:id', SolicitanteController.buscarPorId)
router.put("/:id", SolicitanteController.atualizar)
router.delete("/:id", SolicitanteController.deletar)

export default router