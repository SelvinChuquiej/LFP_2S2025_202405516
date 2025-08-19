import readline from 'readline';
import { cargarArchivo } from './fileService.js';

export function iniciarMenu() {

    let llamadas = [];
    let archivoActual = '';

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function mostrarMenu() {
        console.log('\n--- Menú de Registro de Llamadas ---');
        console.log('1. Cargar registro de llamadas');
        console.log('2. Exportar historial de llamadas');
        console.log('3. Exportar listado de llamadas');
        console.log('4. Exportar listado de clientes');
        console.log('5. Mostrar porcentaje de clasficación de llamadas');
        console.log('6. Mostra cantidad de llamaas por calificación');
        console.log('7. Salir');
        rl.question('Seleccione una opción: ', procesarOpcion);
    }

    function procesarOpcion(opcion) {
        switch (opcion) {
            case '1':
                cargarRegistros();
                return;
            case '7':
                console.log('Saliendo del programa...');
                rl.close();
                return;
            default:
                console.log('Opción no válida. Intente de nuevo.');
        }
        mostrarMenu();
    }

    function cargarRegistros() {
        rl.question('Ingresa el nombre del archivo a cargar guardado en la carpeta data: ', (nombreArchivo) => {
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