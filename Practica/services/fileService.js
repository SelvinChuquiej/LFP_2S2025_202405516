import fs from 'fs';
import CallRecord from '../model/registroLlamada.js';

export function cargarArchivo(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const line = data.split('\n').filter(line => line.trim() !== '');
        return line.map(parseLine)
    } catch (error) {
        console.error(error);
    }
}

function parseLine(line) {
    const parts = line.split(',');
    return new CallRecord(
        parseInt(parts[0].trim()),
        parts[1].trim(),
        parseInt(parts[2].trim()),
        parseInt(parts[3].trim()),
        parts[4].trim()
    );
}