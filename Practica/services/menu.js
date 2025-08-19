import readline from 'readline';

export function iniciarMenu() {

    let llamadas = [];

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
                cargarRegistroLlamadas();
                break;
            case '7':
                console.log('Saliendo del programa...');
                rl.close();
                return;
            default:
                console.log('Opción no válida. Intente de nuevo.');
        }
        mostrarMenu();
    }
    mostrarMenu();
}