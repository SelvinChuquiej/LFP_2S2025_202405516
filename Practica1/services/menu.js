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
    let nombreArchivoActual = '';

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
        console.log('7. Mostrar cantidad de llamadas por calificación');
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
                if (archivoNoCargado()) return;
                generarHistorialLlamadas(llamadas, nombreArchivoActual);
                mostrarMenu();
                return;

            case '3':
                if (archivoNoCargado()) return;
                generarListadoOperadores(llamadas, nombreArchivoActual);
                mostrarMenu();
                return;

            case '4':
                if (archivoNoCargado()) return;
                generarListadoClientes(llamadas, nombreArchivoActual);
                mostrarMenu();
                return;

            case '5':
                if (archivoNoCargado()) return;
                generarRendimientoOperadores(llamadas, nombreArchivoActual);
                mostrarMenu();
                return;

            case '6':
                if (archivoNoCargado()) return;
                porcentajeClasificacion();
                mostrarMenu();
                return;

            case '7':
                if (archivoNoCargado()) return;
                llamadasClasificacion();
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
            const nuevasLlamadas = cargarArchivo(rutaArchivo);
            if (nuevasLlamadas && nuevasLlamadas.length > 0) {
                llamadas = nuevasLlamadas 
                nombreArchivoActual = nombreArchivo
                console.log('Archivo cargado correctamente.');
                console.log(llamadas.length + ' registros de llamadas cargados.');
            } else {
                console.log('No se pudo cargar el archivo o está vacío.');
            }
            mostrarMenu();
        });
    }

    function porcentajeClasificacion() {
        if (!llamadas || llamadas.length === 0) {
            console.log('No hay registros de llamadas cargados.');
            return;
        }

        let buenas = 0, medias = 0, malas = 0;

        llamadas.forEach(lla => {
            if (lla.no_estrellas >= 4) {
                buenas++;
            } else if (lla.no_estrellas >= 2) {
                medias++;
            } else {
                malas++;
            }
        });

        const total = llamadas.length;
        const porcentajeBuenas = ((buenas / total) * 100).toFixed(2);
        const porcentajeMedias = ((medias / total) * 100).toFixed(2);
        const porcentajeMalas = ((malas / total) * 100).toFixed(2);

        console.log("\n--- Porcentaje de Clasificación de Llamadas ---");
        console.log(`Buenas (4-5 estrellas): ${porcentajeBuenas}% (${buenas} llamadas)`);
        console.log(`Medias (2-3 estrellas): ${porcentajeMedias}% (${medias} llamadas)`);
        console.log(`Malas (0-1 estrellas): ${porcentajeMalas}% (${malas} llamadas)`);
    }

    function llamadasClasificacion() {
        const contador = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };

        llamadas.forEach(lla => {
            if (lla.no_estrellas >= 0 && lla.no_estrellas <= 5) {
                contador[lla.no_estrellas]++;
            }
        });

        console.log("\n--- Cantidad de Llamadas por Calificación ---");
        for (let i = 1; i <= 5; i++) {
            console.log(`${i} estrella${i > 1 ? 's' : ''}: ${contador[i]} llamadas`);
        }
    }
    
    function archivoNoCargado() {
        if (!llamadas || llamadas.length === 0) {
            console.log('No hay registros de llamadas cargados.');
            mostrarMenu();
            return true;
        }
        return false;
    }

    mostrarMenu();
}