import errors from 'http-errors'
import express from 'express'
import atendimentoRoutes from './routes/atendimentoRoutes.js'
import portfolioRoutes from './routes/portfolioRoutes.js'
import servicoRoutes from './routes/servicoRoutes.js'
import solicitanteRoutes from './routes/solicitanteRoutes.js'
import tipoOcorrenciaRoutes from './routes/tipoOcorrenciaRoutes.js'
import tipoSolicitanteRoutes from './routes/tipoSolicitanteRoutes.js'
import tipoUsuarioRoutes from './routes/tipoUsuarioRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'


const PORTA = 8001
const HOSTNAME = 'localhost'

const app = express()

//Configuração para json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Rotas
app.get("/", (req, res, next) => {
    res.json({
        resposta: "API de gestão de atendimentos da FGTAS."
    })
})

//Rotas
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
    console.log(`API de gestão de atendimentos da FGTAS executando em http://${HOSTNAME}:${PORTA}`)
})