'use strict'

import express from 'express';
const router = express.Router();

import { analizarLexico } from '../controller/translationController.js';
import { traducirJavaAPython } from '../controller/translationController.js';

router.post('/analizar', analizarLexico);
router.post('/traducir-Python', traducirJavaAPython);

export const archivoRoute = router;