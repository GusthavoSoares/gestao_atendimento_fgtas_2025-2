import { Router } from 'express'

import { TipoSolicitanteController } from '../controller/TipoSolicitanteController.js'

const router = Router()

router.post('/', TipoSolicitanteController.criar)
router.get('/', TipoSolicitanteController.listar)
router.get('/:id', TipoSolicitanteController.buscarPorId)
router.put("/:id", TipoSolicitanteController.atualizar)
router.delete("/:id", TipoSolicitanteController.deletar)

export default router