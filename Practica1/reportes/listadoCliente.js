import fs from 'fs';

export function generarListadoClientes(llamadas, nombreArchivo) {

    const clientesMap = {};

    llamadas.forEach(lla => {
        const idCl = lla.id_cliente;
        const nombreCl = lla.nombre_cliente;
        if (!clientesMap[idCl]) {
            clientesMap[idCl] = {
                id_cliente: idCl,
                nombre_cliente: nombreCl
            };
        }
    });

    const clientes = Object.values(clientesMap);

    let html = `
        <!DOCTYPE html> 
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Listado de Clientes</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; }
                table { width: 45%; border-collapse: collapse; margin-left: auto; margin-right: auto; }
                th, td { border: 1px solid #000000ff; padding: 8px; text-align: left; }
                th { background-color: #ffffffff; }
            </style>
        </head>
        <body>
            <h1>Listado de Clientes</h1>
            <table>
                <thead>
                    <tr>
                        <th>Id Cliente</th>
                        <th>Nombre Cliente</th>
                    </tr>
                </thead>
                <tbody>`;


    clientes.forEach(cl => {
        html += `
                    <tr>
                        <td>${cl.id_cliente}</td>
                        <td>${cl.nombre_cliente}</td>
                    </tr>`;
    });

    html += `
                </tbody>
            </table>
        </body>
        </html>`;

    
    const rutaArchivo = `./reportesHTML/listadoClientes.${nombreArchivo}.html`
    
    if (fs.existsSync(rutaArchivo)) {
        fs.unlinkSync(rutaArchivo);
    }

    fs.writeFileSync(rutaArchivo, html, 'utf8');
    console.log(`Reporte generado: ${rutaArchivo}`);
}