'use strict'

import express from 'express';
const router = express.Router();

import { analizarArchivo } from '../controller/lexicalAnalyzar.controller.js';

router.post('/archivo', analizarArchivo);

export const archivoRoutes = router;