import fs from 'fs';

export function generarListadoOperadores(operadores) {

    const opUnicos = [...new Map(operadores.map(op => [op.id_operador, op])).values()];

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


    opUnicos.forEach(opU => {
        html += `
                    <tr>
                        <td>${opU.id_operador}</td>
                        <td>${opU.nombre_operador}</td>
                    </tr>`;
    });

    html += `
                </tbody>
            </table>
        </body>
        </html>`;

    if (fs.existsSync('./reportesHTML/listadoOperadores.html')) {
        fs.unlinkSync('./reportesHTML/listadoOperadores.html');
    }

    fs.writeFileSync('./reportesHTML/listadoOperadores.html', html, 'utf8');
    console.log('Reporte generado: ./reportesHTML/listadoOperadores.html');
}