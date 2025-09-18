'use strict'

import express from 'express';
import cors from 'cors';

import { archivoRoutes } from '../src/routes/lexicalAnalyzar.routes.js';

const app = express();
const port = 3200;

app.use(express.json());
app.use(cors());

app.use('/api', archivoRoutes);

export function initServer() {
    app.listen(port);
    console.log(`Server listening on port ${port}`);
};
