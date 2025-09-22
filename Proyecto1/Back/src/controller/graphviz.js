export function generarDot(nombreTorneo = '', sede = '', fases = [], bracket = []) {
    // Utilidad para escapar caracteres especiales en etiquetas
    const esc = (s = '') => String(s)
        .replaceAll('\\', '\\\\')
        .replaceAll('"', '\\"')
        .replaceAll('\r\n', '\n')
        .replaceAll('\r', '\n')
        .replaceAll('\n', '\\n');

    // Estilos para clusters y nodos
    const styleCluster = `style="rounded" color="black"`;
    const nodeBase = `shape=rect style=filled fontname="Inter"`;
    const styleGanador = `fillcolor=green color=green fontcolor=white`;
    const stylePerdedor = `fillcolor=red color=red fontcolor=white`;

    // Nombres fijos para nodos por fase
    const nodosCuartos = ['n8', 'n9', 'n13', 'n14'];
    const nodosSemifinal = ['n11', 'n12'];
    const nodosFinal = ['n16', 'n17'];

    // Estructura para guardar nodos por fase
    const nodosPorFase = { cuartos: [], semifinal: [], final: [] };

    // Inicio del grafo DOT
    let dot = `
        digraph {
            graph [compound=true, fontname="Inter"]
            node  [${nodeBase}]
            n5 [shape=oval, style="filled", fillcolor="#eef5ff", label="${esc(nombreTorneo)}\\nSede: ${esc(sede)}"]
    `;

    // ============ FASE 1: CUARTOS ============
    const partidosCuartos = bracket.filter(p => p.fase === 'cuartos');
    if (partidosCuartos.length > 0) {
        dot += `
            subgraph cluster_n7 {
                label="Cuartos" ${styleCluster}
                rank=same
        `;
        partidosCuartos.forEach((partido, idx) => {
            if (idx >= 2) return; // Solo 2 partidos (4 equipos)
            const equipos = String(partido.partido || '').split(' vs ');
            const resultado = String(partido.resultado || '').split('-');
            const equipoA = (equipos[0] || '').trim();
            const equipoB = (equipos[1] || '').trim();
            const ganador = String(partido.ganador || '').trim();

            const nodoA = nodosCuartos[idx * 2];
            const nodoB = nodosCuartos[idx * 2 + 1];

            const resultadoA = (resultado[0] || '-').trim();
            const resultadoB = (resultado[1] || '-').trim();

            const esGanadorA = equipoA === ganador;
            const esGanadorB = equipoB === ganador;

            dot += ` 
                ${nodoA} [label="${esc(equipoA)}: ${esc(resultadoA)}", ${esGanadorA ? styleGanador : stylePerdedor}]
                ${nodoB} [label="${esc(equipoB)}: ${esc(resultadoB)}", ${esGanadorB ? styleGanador : stylePerdedor}]
            `;

            nodosPorFase.cuartos.push({ nodo: nodoA, equipo: equipoA, partido, resultado: resultadoA });
            nodosPorFase.cuartos.push({ nodo: nodoB, equipo: equipoB, partido, resultado: resultadoB });
        });
        dot += `}\n`;

        // Conexión del nodo principal a los nodos de cuartos
        nodosCuartos.forEach(n => { dot += `  n5 -> ${n} [style="invis"]\n`; });

        // Conexiones de cuartos a semifinal
        dot += `  
            n8  -> n11
            n9  -> n11 [style="dotted"]
            n13 -> n12
            n14 -> n12 [style="dotted"]
        `;

    } else {
        // Si no hay cuartos, conecta el nodo principal a los nodos de semifinal
        nodosSemifinal.forEach(n => { dot += `  n5 -> ${n} [style="invis"]\n`; });
        dot += `\n`;
    }

    // ============ FASE 2: SEMIFINAL ============
    const partidosSemifinal = bracket.filter(p => p.fase === 'semifinal');
    dot += `  
    subgraph cluster_n10 {
        label="Semifinal" ${styleCluster}
        rank=same
    `;
    partidosSemifinal.forEach((partido, idx) => {
        if (idx >= 1) return; // Solo 1 partido (2 equipos)
        const equipos = String(partido.partido || '').split(' vs ');
        const resultado = String(partido.resultado || '').split('-');
        const equipoA = (equipos[0] || '').trim();
        const equipoB = (equipos[1] || '').trim();
        const ganador = String(partido.ganador || '').trim();

        const nodoA = nodosSemifinal[idx * 2];
        const nodoB = nodosSemifinal[idx * 2 + 1];

        const resultadoA = (resultado[0] || '-').trim();
        const resultadoB = (resultado[1] || '-').trim();

        const esGanadorA = equipoA === ganador;
        const esGanadorB = equipoB === ganador;

        dot += `
            ${nodoA} [label="${esc(equipoA)}: ${esc(resultadoA)}", ${esGanadorA ? styleGanador : stylePerdedor}]
            ${nodoB} [label="${esc(equipoB)}: ${esc(resultadoB)}", ${esGanadorB ? styleGanador : stylePerdedor}]
        `;

        nodosPorFase.semifinal.push({ nodo: nodoA, equipo: equipoA, partido, resultado: resultadoA });
        nodosPorFase.semifinal.push({ nodo: nodoB, equipo: equipoB, partido, resultado: resultadoB });
    });
    dot += `}\n`;

    // ============ FASE 3: FINAL ============
    const partidosFinal = bracket.filter(p => p.fase === 'final');
    dot += `  
    subgraph cluster_n15 {
        label="Final" ${styleCluster}
        rank=same
    `;

    if (partidosFinal.length > 0) {
        const partido = partidosFinal[0];
        const equipos = String(partido.partido || '').split(' vs ');
        const resultado = String(partido.resultado || '').split('-');
        const ganador = String(partido.ganador || '').trim();

        if (equipos.length === 2) {
            const equipoA = (equipos[0] || '').trim();
            const equipoB = (equipos[1] || '').trim();
            const resultadoA = (resultado[0] || '-').trim();
            const resultadoB = (resultado[1] || '-').trim();

            const esGanadorA = equipoA === ganador;
            const esGanadorB = equipoB === ganador;

            dot += `    
                ${nodosFinal[0]} [label="${esc(equipoA)}: ${esc(resultadoA)}", ${esGanadorA ? styleGanador : stylePerdedor}]
                ${nodosFinal[1]} [label="${esc(equipoB)}: ${esc(resultadoB)}", ${esGanadorB ? styleGanador : stylePerdedor}]
            `;
            nodosPorFase.final.push({ nodo: nodosFinal[0], equipo: equipoA, partido, resultado: resultadoA });
            nodosPorFase.final.push({ nodo: nodosFinal[1], equipo: equipoB, partido, resultado: resultadoB });
        } else {
            dot += `    
                ${nodosFinal[0]} [label="${esc(ganador)}", ${styleGanador}]
            `;
            nodosPorFase.final.push({ nodo: nodosFinal[0], equipo: ganador, partido });
        }
    }
    dot += `}\n`;

    // ============ CONEXIONES ENTRE FASES ============
    // Si no hay cuartos, conecta el nodo principal a los nodos de semifinal
    if (partidosCuartos.length === 0) {
        nodosSemifinal.forEach(n => { dot += `  n5 -> ${n} [style="invis"]\n`; });
    }

    // Conexiones de semifinal a final (solo al nodo ganador)
    if (partidosFinal.length && nodosPorFase.final.length === 2 && nodosPorFase.semifinal.length >= 2) {
        const ganadorFinal = String(partidosFinal[0].ganador || '').trim();
        const nodoGanadorFinal = nodosPorFase.final.find(n => n.equipo === ganadorFinal);

        if (nodoGanadorFinal) {
            const equipoSemifinalA = nodosPorFase.semifinal[0].equipo;
            const equipoSemifinalB = nodosPorFase.semifinal[1].equipo;

            dot += `  
                n11 -> ${nodoGanadorFinal.nodo}${equipoSemifinalA === ganadorFinal ? '' : ' [style="dotted"]'}
                n12 -> ${nodoGanadorFinal.nodo}${equipoSemifinalB === ganadorFinal ? '' : ' [style="dotted"]'}
            `;
        }
    } else if (partidosFinal.length && nodosPorFase.final.length === 1) {
        dot += `   
            n11 -> ${nodosFinal[0]}
            n12 -> ${nodosFinal[0]}
        `;
    } else {
        dot += `  
            n11 -> ${nodosFinal[0]} [style="dotted"]
            n12 -> ${nodosFinal[1]} [style="dotted"]
        `;
    }

    dot += `}`;

    return dot;
}
