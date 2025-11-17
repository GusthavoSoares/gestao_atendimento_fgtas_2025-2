import { Router } from 'express'

import { AtendimentoController } from '../controller/AtendimentoController.js'

const router = Router()

router.post('/', AtendimentoController.criar)
router.get('/', AtendimentoController.listar)
router.get('/:id', AtendimentoController.buscarPorId)
router.put("/:id", AtendimentoController.atualizar)
router.delete("/:id", AtendimentoController.deletar)

export default router