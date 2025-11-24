import { Router } from 'express'

import { ServicoController } from '../controller/ServicoController.js'

const router = Router()

router.post('/', ServicoController.criar)
router.get('/', ServicoController.listar)
router.get('/inativos', ServicoController.listarInativos)
router.get('/:id', ServicoController.buscarPorId)
router.put("/:id", ServicoController.atualizar)
router.delete("/:id", ServicoController.deletar)

export default router