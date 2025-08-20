import fs from 'fs';

export function generarHistorialLlamadas(llamadas) {
    let html = `
        <!DOCTYPE html> 
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Historial de Llamadas</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; }
                table { width: 75%; border-collapse: collapse; margin-left: auto; margin-right: auto; }
                th, td { border: 1px solid #000000ff; padding: 8px; text-align: left; }
                th { background-color: #ffffffff; }
            </style>
        </head>
        <body>
            <h1>Historial de Llamadas</h1>
            <table>
                <thead>
                    <tr>
                        <th>Id Operador</th>
                        <th>Nombre Operador</th>
                        <th>Número de Estrellas</th>
                        <th>Id Cliente</th>
                        <th>Nombre Cliente</th>
                    </tr>                </thead>
            <tbody>
    `;

    llamadas.forEach(ll => {
        html += `
                    <tr>
                        <td>${ll.id_operador}</td>
                        <td>${ll.nombre_operador}</td>
                        <td>${ll.no_estrellas}</td>
                        <td>${ll.id_cliente}</td>
                        <td>${ll.nombre_cliente}</td>
                    </tr>`;
    });

    html += `
                </tbody>
            </table>
        </body>
        </html>`;

    if (fs.existsSync('./reportesHTML/historialLlamadas.html')) {
        fs.unlinkSync('./reportesHTML/historialLlamadas.html');
    }

    fs.writeFileSync('./reportesHTML/historialLlamadas.html', html, 'utf8');
    console.log('Reporte generado: ./reportesHTML/historialLlamadas.html');
}