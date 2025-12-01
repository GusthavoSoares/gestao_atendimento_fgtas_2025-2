import cors from 'cors'
import errors from 'http-errors'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import atendimentoRoutes from './routes/atendimentoRoutes.js'
import portfolioRoutes from './routes/portfolioRoutes.js'
import servicoRoutes from './routes/servicoRoutes.js'
import solicitanteRoutes from './routes/solicitanteRoutes.js'
import tipoOcorrenciaRoutes from './routes/tipoOcorrenciaRoutes.js'
import tipoSolicitanteRoutes from './routes/tipoSolicitanteRoutes.js'
import tipoUsuarioRoutes from './routes/tipoUsuarioRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORTA = 8001
const HOSTNAME = 'localhost'
const app = express()
app.use(cors({
    origin: ['http:
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        return res.sendStatus(204);
    }
    next();
});
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'files')))
app.get("/", (req, res, next) => {
    res.json({ resposta: "API de gestão de atendimentos da FGTAS." })
})
app.use('/atendimentos', atendimentoRoutes)
app.use('/portfolios', portfolioRoutes)
app.use('/servicos', servicoRoutes)
app.use('/solicitantes', solicitanteRoutes)
app.use('/tiposOcorrencias', tipoOcorrenciaRoutes)
app.use('/tiposSolicitantes', tipoSolicitanteRoutes)
app.use('/tiposUsuarios', tipoUsuarioRoutes)
app.use('/usuarios', usuarioRoutes)
app.use((req, res, next) => next(errors(404)))
app.use((erro, req, res, next) => {
    console.error(erro)
    res.status(erro.status || 500).json({ erro: erro.message || "Erro no servidor" })
})
app.listen(PORTA, () => {
    console.log(`API rodando em http:
})
