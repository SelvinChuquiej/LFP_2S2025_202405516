'use strict'

import express from 'express';
const router = express.Router();

import { analizarLexico } from '../controller/translationController.js';

router.post('/analizar', analizarLexico);

export const archivoRoute = router;