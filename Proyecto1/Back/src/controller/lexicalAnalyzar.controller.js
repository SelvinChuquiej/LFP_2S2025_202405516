'use strict'

export function analizarArchivo(req, res) {
    const { contenido } = req.body;
    if (!contenido) {
        return res.status(400).json({ error: 'No se proporcionó contenido del archivo.' });
    }

    console.log('Contenido del archivo recibido:', contenido);

    res.json({ message: 'Archivo recibido y procesado correctamente.', contenido });
}