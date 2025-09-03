import fs from 'fs';

export function generarRendimientoOperadores(llamadas, nombreArchivo) {

    const operadoresMap = {};

    llamadas.forEach(ll => {
        const idOp = ll.id_operador;
        const nombreOp = ll.nombre_operador;

        if (!operadoresMap[idOp]) {
            operadoresMap[idOp] = {
                id_operador: idOp,
                nombre_operador: nombreOp,
                totalLlamadas: 0
            };

        }

        operadoresMap[idOp].totalLlamadas++;
    });

    const operadores = Object.values(operadoresMap);
    const totalLlamadas = llamadas.length;

    operadores.forEach(op => {
        op.porcentaje_atencion = ((op.totalLlamadas / totalLlamadas) * 100).toFixed(2) + '%';
    });

    let html = `
        <!DOCTYPE html> 
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Rendimiento de Operadores</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; }
                table { width: 45%; border-collapse: collapse; margin-left: auto; margin-right: auto; }
                th, td { border: 1px solid #000000ff; padding: 8px; text-align: left; }
                th { background-color: #ffffffff; }
            </style>
        </head>
        <body>
            <h1>Rendimiento de Operadores</h1>
            <table>
                <thead>
                    <tr>
                        <th>Id Operador</th>
                        <th>Nombre Operador</th>
                        <th>Total Llamadas</th>
                        <th>Porcentaje de atencion</th>
                    </tr>
                </thead>
                <tbody>`;


    operadores.forEach(op => {
        html += `
                    <tr>
                        <td>${op.id_operador}</td>
                        <td>${op.nombre_operador}</td>
                        <td>${op.totalLlamadas}</td>
                        <td>${op.porcentaje_atencion}</td>
                    </tr>`;
    });

    html += `
                </tbody>
            </table>
        </body>
        </html>`;


      const rutaArchivo = `./reportesHTML/rendimientoOperadores.${nombreArchivo}.html`
    if (fs.existsSync(rutaArchivo)) {
        fs.unlinkSync(rutaArchivo);
    }

    fs.writeFileSync(rutaArchivo, html, 'utf8');
    console.log(`Reporte generado: ${rutaArchivo}`);
}