'use strict'
import { Analizador } from '../model/analizador.js';

export function analizarArchivo(req, res) {
    const { contenido } = req.body;
    if (!contenido) {
        return res.status(400).json({ error: 'No se proporcionó contenido del archivo.' });
    }

    const analizador = new Analizador(contenido);
    const resultado = analizador.analizar();
    //console.log(resultado.errores);
    //console.log(resultado.tokens);
    return res.json({
        tokens: resultado.tokens,
        errores: resultado.errores,
        bracket: resultado.bracket,
        estadisticas: resultado.estadisticas,
        goleadores: resultado.listaGoleadores
    });
}; 