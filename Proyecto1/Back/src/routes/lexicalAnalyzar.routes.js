'use strict'

const express = require('express');
const router = express.Router();
const { analizarArchivo } = require('../controller/lexicalAnalyzar.controller');

router.post('/archivo', analizarArchivo);

module.exports = router;