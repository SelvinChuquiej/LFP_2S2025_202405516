'use strict';

export class Token {
    constructor(lexema, tipo, fila, columna) {
        this.lexema = lexema;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
    }
}

export const RESERVADAS = [
    "TORNEO",
    "EQUIPOS",
    "ELIMINACION",
    "equipo",
    "jugador",
    "partido",
    "resultado",
    "jugador",
    "goleador"
];

export const ATRIBUTOS = [
    "nombre",
    "sede",
    "equipos",
    "posicion",
    "numero",
    "edad",
    "cuartos",
    "semifinal",
    "final",
    "vs",
    "goleadores",
    "minuto"
];

export const SIMBOLOS = {
    "{": "LLAVE_IZQUIERDA",
    "}": "LLAVE_DERECHA",
    "[": "CORCHETE_IZQUIERDO",
    "]": "CORCHETE_DERECHO",
    ",": "COMA",
    ":": "DOS_PUNTOS",
    ";": "PUNTO_Y_COMA",
    "(": "PARENTESIS_IZQUIERDO",
    ")": "PARENTESIS_DERECHO"
};

