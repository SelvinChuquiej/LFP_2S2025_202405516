'use strict'
import { Analizador } from '../model/analizador.js';

export function analizarArchivo(req, res) {
    const { contenido } = req.body;
    if (!contenido) {
        return res.status(400).json({ error: 'No se proporcionó contenido del archivo.' });
    }

    const analizador = new Analizador(contenido);
    const resultado = analizador.analizar();
    //console.log(resultado.tokens);
    console.log(resultado.errores);
    
    
}; 