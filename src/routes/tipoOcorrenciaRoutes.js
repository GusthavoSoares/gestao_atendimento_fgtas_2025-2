import { Router } from 'express'

import { TipoOcorrenciaController } from '../controller/TipoOcorrenciaController.js'

const router = Router()

router.post('/', TipoOcorrenciaController.criar)
router.get('/', TipoOcorrenciaController.listar)
router.get('/:id', TipoOcorrenciaController.buscarPorId)
router.put("/:id", TipoOcorrenciaController.atualizar)
router.delete("/:id", TipoOcorrenciaController.deletar)

export default router