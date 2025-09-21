'use strict';
import { Token, RESERVADAS, ATRIBUTOS, SIMBOLOS } from './token.js';

export class Analizador {
    constructor(cadena) {
        this.cadena = cadena;
        this.pos = 0; //Posicion actual
        this.fila = 1; //Fila actual
        this.columna = 1; //Columna actual
        this.tokens = []; //Lista de tokens
        this.errores = []; //Lista de errores
        this.estado = "INICIO"; //Estado inicial AFD
    }

    analizar() {
        while (this.pos < this.cadena.length) {
            let char = this.cadena[this.pos];
            if (this.estado === "INICIO") {
                if (char === " " || char === "\t" || char === "\r") {
                    this.avanzar();
                    continue;
                }
                if (char === "\n") {
                    this.fila++;
                    this.columna = 1;
                    this.pos++;
                    continue;
                }
                if (this.esLetra(char)) {
                    this.estado = "IDENT";
                    this.buffer = ""; // Permite almacenar caractereces
                    this.inicioColumna = this.columna; // Marca el inicio de la columna
                    continue;
                }
                if (this.esDigito(char)) {
                    this.estado = "NUM";
                    this.buffer = "";
                    this.inicioColumna = this.columna;
                    continue;
                }
                if (char === '"') {
                    this.estado = "CADENA";
                    this.buffer = "";
                    this.inicioColumna = this.columna;
                    this.avanzar();
                    continue;
                }
                if (Object.keys(SIMBOLOS).includes(char)) {
                    this.tokens.push(new Token(char, SIMBOLOS[char], this.fila, this.columna));
                    this.avanzar();
                    continue;
                }
                this.agregarError(char, "TOKEN INVALIDO", "Caracter no reconocido");
                this.avanzar();
            } else if (this.estado === "IDENT") {
                if (this.esLetra(this.cadena[this.pos])) {
                    this.buffer += this.cadena[this.pos]
                    this.avanzar();
                } else {
                    this.agregarTokenIdent(this.buffer, this.inicioColumna);
                    this.estado = "INICIO"
                }
            } else if (this.estado === "NUM") {
                if (this.esDigito(this.cadena[this.pos])) {
                    this.buffer += this.cadena[this.pos]
                    this.avanzar();
                } else {
                    this.tokens.push(new Token(this.buffer, "NUMERO", this.fila, this.inicioColumna));
                    this.estado = "INICIO"
                }
            } else if (this.estado === "CADENA") {
                if (this.cadena[this.pos] === '"') { //Cierra Cadena
                    this.tokens.push(new Token(this.buffer, "TEXTO", this.fila, this.inicioColumna));
                    this.avanzar();
                    this.estado = "INICIO"
                } else if (this.pos >= this.cadena.length) {
                    this.agregarError(this.buffer, "TOKEN INVALIDO", "Cadena no cerrada");
                    this.estado = "INICIO"
                } else {
                    if (char === '\n') {
                        this.fila++;
                        this.columna = 1;
                        this.agregarError(this.buffer, "TOKEN INVALIDO", "Cadena no cerrada", this.inicioColumna);
                        this.estado = "INICIO"
                        this.buffer = "";
                        this.avanzar();
                        continue;
                    }
                    this.buffer += this.cadena[this.pos];
                    this.avanzar();
                }
            }
        }
        //console.log('TOKENS:', this.tokens);
        //console.log('BRACKET:', bracket);
        const bracket = generarBracket(this.tokens); // genera el bracket al final
        const estadisticas = calcularEstadisticas(bracket, this.tokens);
        const listaGoleadores = goleadores(this.tokens);
        return { tokens: this.tokens, errores: this.errores, bracket, estadisticas, listaGoleadores };
    }

    agregarTokenIdent(lexema, inicioColumna) {
        if (RESERVADAS.includes(lexema)) {
            this.tokens.push(new Token(lexema, "RESERVADA", this.fila, inicioColumna));
        } else if (ATRIBUTOS.includes(lexema)) {
            this.tokens.push(new Token(lexema, "ATRIBUTO", this.fila, inicioColumna));
        } else {
            this.agregarError(lexema, "TOKEN INVALIDO", "Identificador no reconocido", inicioColumna);
        }

    }

    agregarError(lexema, tipo, descripcion, inicioColumna = this.columna) {
        this.errores.push({ lexema, tipo, descripcion, fila: this.fila, columna: inicioColumna });
    }

    esDigito(c) {
        return (c >= '0' && c <= '9');
    }

    esLetra(c) {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
    }

    avanzar() {
        this.pos++;
        this.columna++;
    }
}

function generarBracket(tokens) {
    const fases = ['octavos', 'cuartos', 'semifinal', 'final'];
    let faseActual = '';
    const bracket = [];
    let i = 0;

    while (i < tokens.length) {
        const token = tokens[i];

        // Detecta la fase actual
        if (token.tipo === 'ATRIBUTO' && fases.includes(token.lexema)) {
            faseActual = token.lexema;
        }

        // Detecta un partido
        if (token.tipo === 'RESERVADA' && token.lexema === 'partido') {
            let partido = { fase: faseActual, partido: '', resultado: '', ganador: '' };

            // Busca los equipos
            let equipoA = tokens[i + 2]?.lexema || '';
            let equipoB = tokens[i + 4]?.lexema || '';

            // Busca el resultado
            let resultado = '';
            for (let j = i; j < tokens.length; j++) {
                if (tokens[j].tipo === 'RESERVADA' && tokens[j].lexema === 'resultado') {
                    resultado = tokens[j + 2]?.lexema || '';
                    break;
                }
            }

            const [golesA, golesB] = resultado.split('-').map(Number)
            if (golesA > golesB) {
                partido.ganador = equipoA;
            } else if (golesB > golesA) {
                partido.ganador = equipoB;
            } else {
                partido.ganador = 'Empate';
            }

            partido.partido = `${equipoA} ` + ATRIBUTOS[ATRIBUTOS.indexOf('vs')] + ` ${equipoB}`;
            partido.resultado = resultado;

            bracket.push(partido);
        }
        i++;
    }
    return bracket;
}


function calcularEstadisticas(brackets, tokens) {
    const equipos = {};
    const ordenFases = {
        'octavos': 1,
        'cuartos': 2,
        'semifinal': 3,
        'final': 4
    };

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.tipo === 'RESERVADA' && token.lexema === 'equipo') {
            const nombreEquipo = tokens[i + 2]?.lexema || '';
            if (nombreEquipo && !equipos[nombreEquipo]) {
                equipos[nombreEquipo] = {
                    equipo: nombreEquipo,
                    partidosJugados: 0,
                    ganados: 0,
                    perdidos: 0,
                    golesAFavor: 0,
                    golesEnContra: 0,
                    diferencia: 0,
                    faseAlcanzada: 'N/A'
                };
            }
        }
    }

    brackets.forEach(partido => {
        const [equipoA, equipoB] = partido.partido.split(' vs ');
        const [golesA, golesB] = partido.resultado.split('-').map(Number);

        // Suma partidos jugados
        equipos[equipoA].partidosJugados += 1;
        equipos[equipoB].partidosJugados += 1;

        // Suma goles
        equipos[equipoA].golesAFavor += golesA;
        equipos[equipoA].golesEnContra += golesB;
        equipos[equipoB].golesAFavor += golesB;
        equipos[equipoB].golesEnContra += golesA;

        // Diferencia de goles
        equipos[equipoA].diferencia = equipos[equipoA].golesAFavor - equipos[equipoA].golesEnContra;
        equipos[equipoB].diferencia = equipos[equipoB].golesAFavor - equipos[equipoB].golesEnContra;

        // Ganados y perdidos
        if (golesA > golesB) {
            equipos[equipoA].ganados += 1;
            equipos[equipoB].perdidos += 1;
        } else if (golesB > golesA) {
            equipos[equipoB].ganados += 1;
            equipos[equipoA].perdidos += 1;
        }

        // Fase alcanzada (puedes actualizar según la lógica de tu torneo)
        equipos[equipoA].faseAlcanzada = partido.fase;
        equipos[equipoB].faseAlcanzada = partido.fase;
    });

    const equiposArray = Object.values(equipos);
    equiposArray.sort((a, b) => ordenFases[b.faseAlcanzada] - ordenFases[a.faseAlcanzada]);
    return equiposArray;
}

function goleadores(tokens) {
    const jugadorEquipo = {}
    let equipoActual = ''

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.tipo === 'RESERVADA' && token.lexema === 'equipo') {
            equipoActual = tokens[i + 2]?.lexema || '';
        }
        if (token.tipo === 'RESERVADA' && token.lexema === 'jugador') {
            const jugador = tokens[i + 2]?.lexema || '';
            if (jugador) {
                jugadorEquipo[jugador] = equipoActual;
            }
        }
    }

    const lista = {};
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.tipo === 'RESERVADA' && token.lexema === 'goleador') {
            const jugador = tokens[i + 2]?.lexema || '';
            const equipo = jugadorEquipo[jugador] || '';
            let minuto = '';
            for (let j = i; j < tokens.length; j++) {
                if (tokens[j].tipo === 'ATRIBUTO' && tokens[j].lexema === 'minuto') {
                    minuto = tokens[j + 2]?.lexema || '';
                    break;
                }
            }

            if (!lista[jugador]) {
                lista[jugador] = { equipo, goles: 1, minutos: [minuto] };
            } else {
                lista[jugador].goles += 1;
                lista[jugador].minutos.push(minuto);
            }
        }
    }

    const goleadoresArray = Object.entries(lista).map(([jugador, datos], idx) => ({
        posicion: idx + 1,
        jugador,
        equipo: datos.equipo,
        goles: datos.goles,
        minutos: datos.minutos.join(', ')
    })).sort((a, b) => b.goles - a.goles).map((g, idx) => ({ ...g, posicion: idx + 1 }));

    return goleadoresArray;
}