import express from 'express'
import bodyParser from 'body-parser'

import appRouter from './routes'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

appRouter(app)

const server = app.listen(9000, function () {
    console.log('app running on port.', server.address().port)
})

export default app
