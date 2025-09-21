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
        console.log('TOKENS:', this.tokens);
        const bracket = generarBracket(this.tokens); // genera el bracket al final
        console.log('BRACKET:', bracket);
        return { tokens: this.tokens, errores: this.errores, bracket };
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

export function generarBracket(tokens) {
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
                partido.ganador = 'Empate'; // O alguna otra lógica para empates
            }

            partido.partido = `${equipoA} ` + ATRIBUTOS[ATRIBUTOS.indexOf('vs')] + ` ${equipoB}`;
            partido.resultado = resultado;

            bracket.push(partido);
        }
        i++;
    }
    return bracket;
}