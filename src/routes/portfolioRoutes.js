import { Router } from 'express'

import { PortfolioController } from '../controller/PortfolioController.js'

const router = Router()

router.post('/', PortfolioController.criar)
router.get('/', PortfolioController.listar)
router.get('/inativos', PortfolioController.listarInativos)
router.get('/:id', PortfolioController.buscarPorId)
router.put("/:id", PortfolioController.atualizar)
router.delete("/:id", PortfolioController.deletar)

export default router