'use strict'
import { Analizador } from '../model/analizador.js';
import { generarDot } from './graphviz.js';

export function analizarArchivo(req, res) {
    const { contenido } = req.body;
    if (!contenido) {
        return res.status(400).json({ error: 'No se proporcionó contenido del archivo.' });
    }

    const analizador = new Analizador(contenido);
    const resultado = analizador.analizar();

    const nombreTorneo = resultado.informacionTorneo?.find(e => e.estadistica === 'Nombre del Torneo')?.valor || '';
    const sede = resultado.informacionTorneo?.find(e => e.estadistica === 'Sede')?.valor || '';
    const fases = resultado.bracket ? [...new Set(resultado.bracket.map(p => p.fase))] : [];
    const dot = generarDot(nombreTorneo, sede, fases, resultado.bracket);


    //console.log(resultado.errores);
    //console.log(resultado.tokens);
    return res.json({
        tokens: resultado.tokens,
        errores: resultado.errores,
        bracket: resultado.bracket,
        estadisticas: resultado.estadisticas,
        goleadores: resultado.listaGoleadores,
        torneos: resultado.informacionTorneo,
        dot
    });
}; 