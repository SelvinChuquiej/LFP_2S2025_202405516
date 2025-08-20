import readline from 'readline';
import fs from 'fs';
import { cargarArchivo } from './fileService.js';
import { generarHistorialLlamadas } from '../reportes/historialLlamadas.js';
import { generarListadoOperadores } from '../reportes/listadoOperadores.js';
import { generarListadoClientes } from '../reportes/listadoCliente.js';
import { generarRendimientoOperadores } from '../reportes/rendimientoOperador.js';

export function iniciarMenu() {

    if (!fs.existsSync('./reportesHTML')) {
        fs.mkdirSync('./reportesHTML');
    }

    let llamadas = [];

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function mostrarMenu() {
        console.log("\n" + "=".repeat(50))
        console.log('--- Menú de Registro de Llamadas ---');
        console.log('1. Cargar registro de llamadas');
        console.log('2. Exportar historial de llamadas');
        console.log('3. Exportar listado de operadores');
        console.log('4. Exportar listado de clientes');
        console.log('5. Exportar Rendimiento de Operadores');
        console.log('6. Mostrar porcentaje de clasficación de llamadas');
        console.log('7. Mostra cantidad de llamaas por calificación');
        console.log('8. Salir');
        console.log("" + "=".repeat(50))
        rl.question('Seleccione una opción: ', procesarOpcion);

    }

    function procesarOpcion(opcion) {
        switch (opcion) {
            case '1':
                cargarRegistros();
                return;

            case '2':
                generarHistorialLlamadas(llamadas);
                mostrarMenu();
                return;

            case '3':
                generarListadoOperadores(llamadas);
                mostrarMenu();
                return;

            case '4':
                generarListadoClientes(llamadas);
                mostrarMenu();
                return;

            case '5':
                generarRendimientoOperadores(llamadas);
                mostrarMenu();
                return;

            case '8':
                console.log('Saliendo del programa...');
                rl.close();
                return;

            default:
                console.log('Opción no válida. Intente de nuevo.');
        }
        mostrarMenu();
    }

    function cargarRegistros() {
        rl.question('\nIngresa el nombre del archivo (guardado en la carpeta data): ', (nombreArchivo) => {
            const rutaArchivo = `./data/${nombreArchivo}.csv`;
            llamadas = cargarArchivo(rutaArchivo);
            if (llamadas && llamadas.length > 0) {
                console.log('Archivo cargado correctamente.');
                console.log(llamadas);
            } else {
                console.log('o se pudo cargar el archivo o está vacío.');
            }
            mostrarMenu();
        });
    }


    mostrarMenu();
}