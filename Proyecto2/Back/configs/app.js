'use strict'

import express from 'express'
import cors from 'cors'

import { archivoRoute } from '../src/routes/translationRoutes.js'

const app = express()
const PORT = 3200

app.use(express.json())
app.use(cors())

app.use('/api', archivoRoute)

export function startServer() {
    app.listen(PORT)
    console.log(`Server is running on http://localhost:${PORT}`);
}
    

