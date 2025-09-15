'use strict'

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3200;

const archivoRoutes = require('../src/routes/lexicalAnalyzar.routes');

app.use(express.json());
app.use(cors());

app.use('/api', archivoRoutes);

exports.initServer = () => {
    app.listen(port);
    console.log(`Server listening on port ${port}`);
};
