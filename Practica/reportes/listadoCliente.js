import fs from 'fs';

export function generarListadoClientes(clientes) {

    const cliUnicos = [...new Map(clientes.map(cl => [cl.id_cliente, cl])).values()];

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


    cliUnicos.forEach(cl => {
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

    if (fs.existsSync('./reportesHTML/listadoClientes.html')) {
        fs.unlinkSync('./reportesHTML/listadoClientes.html');
    }

    fs.writeFileSync('./reportesHTML/listadoClientes.html', html, 'utf8');
    console.log('Reporte generado: ./reportesHTML/listadoClientes.html');
}