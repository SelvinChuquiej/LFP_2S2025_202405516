import fs from 'fs';

export function generarListadoOperadores(llamadas, nombreArchivo) {

    const operadoresMap = {};

    llamadas.forEach(lla => {
        const idOp = lla.id_operador;
        const nombreOp = lla.nombre_operador;
        if (!operadoresMap[idOp]) {
            operadoresMap[idOp] = {
                id_operador: idOp,
                nombre_operador: nombreOp
            };
        }
    });

    const operadores = Object.values(operadoresMap);

    let html = `
        <!DOCTYPE html> 
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Listado de Operadores</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; }
                table { width: 45%; border-collapse: collapse; margin-left: auto; margin-right: auto; }
                th, td { border: 1px solid #000000ff; padding: 8px; text-align: left; }
                th { background-color: #ffffffff; }
            </style>
        </head>
        <body>
            <h1>Listado de Operadores</h1>
            <table>
                <thead>
                    <tr>
                        <th>Id Operador</th>
                        <th>Nombre Operador</th>
                    </tr>
                </thead>
                <tbody>`;


    operadores.forEach(op => {
        html += `
                    <tr>
                        <td>${op.id_operador}</td>
                        <td>${op.nombre_operador}</td>
                    </tr>`;
    });

    html += `
                </tbody>
            </table>
        </body>
        </html>`;

    const rutaArchivo = `./reportesHTML/listadoOperadores.${nombreArchivo}.html`;
    
    if (fs.existsSync(rutaArchivo)) {
        fs.unlinkSync(rutaArchivo);
    }

    fs.writeFileSync(rutaArchivo, html, 'utf8');
    console.log(`Reporte generado: ${rutaArchivo}`);
}