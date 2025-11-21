import errors from 'http-errors'
import express from 'express'
import atendimentoRoutes from './routes/atendimentoRoutes.js'
import tipoSolicitanteRoutes from './routes/tipoSolicitanteRoutes.js'

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
app.use('/tiposSolicitantes', tipoSolicitanteRoutes)


app.use((req, res, next) => next(errors(404)))

app.use((erro, req, res, next) => {
    console.error(erro)
    res.status(erro.status || 500).json({ erro: erro.message || "Erro no servidor" })
})

app.listen(PORTA, () => {
    console.log(`API de gestão de atendimentos da FGTAS executando em http://${HOSTNAME}:${PORTA}`)
})