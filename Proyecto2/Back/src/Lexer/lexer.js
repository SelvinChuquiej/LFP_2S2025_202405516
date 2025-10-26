import { Token, ReservedWords, Symbols } from "../models/token.js";
import { Error } from "../models/error.js";
import { Character } from "../utils/character.js";

export class Lexer {
    constructor(code) {
        this.code = code;
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
        this.errors = [];
    }

    // Método principal: Ejecuta el análisis léxico completo.
    analyze() {
        while (true) {
            const token = this.getNextToken();
            if (!token) continue;
            if (token.type === "EOF") break;
            this.tokens.push(token);
        }
        return { tokens: this.tokens, errors: this.errors, success: this.errors.length === 0 };
    }

    // Obtiene el siguiente token usando el autómata principal.
    getNextToken() {
        return this.S0();
    }

    // Devuelve el siguiente carácter sin avanzar la posición.
    peekChar() {
        if (this.position >= this.code.length) return null;
        return this.code[this.position];
    }

    // Devuelve el siguiente carácter y avanza la posición.
    nextChar() {
        if (this.position >= this.code.length) return null;
        const char = this.code[this.position];
        this.position++;
        if (char === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }
        return char;
    }

    // Salta espacios en blanco y tabulaciones.
    skipWhitespace() {
        while (this.position < this.code.length) {
            const char = this.peekChar();
            if (Character.isWhitespace(char)) {
                this.nextChar();
            } else {
                break;
            }
        }
    }

    // ESTADOS DEL AUTÓMATA (AFD)
    // S0: Estado inicial. Decide el tipo de token a reconocer según el primer carácter.
    S0() {
        this.skipWhitespace();

        if (this.position >= this.code.length) {
            return new Token('EOF', 'EOF', this.line, this.column);
        }

        const currentChar = this.peekChar();

        // Identificadores o palabras reservadas
        if (Character.isLetter(currentChar) || currentChar === '_') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S1(buffer, startLine, startColumn);
        }

        // Números (enteros o decimales)
        if (Character.isDigit(currentChar)) {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S2(buffer, startLine, startColumn);
        }

        // Cadenas de texto
        if (currentChar === '"') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S5(buffer, startLine, startColumn);
        }

        // Caracteres (char)
        if (currentChar === "'") {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S7(buffer, startLine, startColumn);
        }

        // Operadores aritméticos y lógicos
        if (currentChar === '+') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S10(buffer, startLine, startColumn);
        }
        if (currentChar === '-') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S12(buffer, startLine, startColumn);
        }
        if (currentChar === '*') {
            const startLine = this.line;
            const startColumn = this.column;
            this.nextChar();
            return new Token('MULTIPLY', '*', startLine, startColumn);
        }
        if (currentChar === '/') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S14(buffer, startLine, startColumn);
        }
        if (currentChar === '=') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S15(buffer, startLine, startColumn);
        }
        if (currentChar === '!') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S17(buffer, startLine, startColumn);
        }
        if (currentChar === '>') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S19(buffer, startLine, startColumn);
        }
        if (currentChar === '<') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S21(buffer, startLine, startColumn);
        }

        // Delimitadores y símbolos simples
        if (currentChar === '{') {
            const startLine = this.line;
            const startColumn = this.column;
            this.nextChar();
            return new Token(Symbols['{'], '{', startLine, startColumn);
        }
        if (currentChar === '}') {
            const startLine = this.line;
            const startColumn = this.column;
            this.nextChar();
            return new Token(Symbols['}'], '}', startLine, startColumn);
        }
        if (currentChar === '(') {
            const startLine = this.line;
            const startColumn = this.column;
            this.nextChar();
            return new Token(Symbols['('], '(', startLine, startColumn);
        }
        if (currentChar === ')') {
            const startLine = this.line;
            const startColumn = this.column;
            this.nextChar();
            return new Token(Symbols[')'], ')', startLine, startColumn);
        }
        if (currentChar === '[') {
            const startLine = this.line;
            const startColumn = this.column;
            this.nextChar();
            return new Token(Symbols['['], '[', startLine, startColumn);
        }
        if (currentChar === ']') {
            const startLine = this.line;
            const startColumn = this.column;
            this.nextChar();
            return new Token(Symbols[']'], ']', startLine, startColumn);
        }
        if (currentChar === ';') {
            const startLine = this.line;
            const startColumn = this.column;
            this.nextChar();
            return new Token(Symbols[';'], ';', startLine, startColumn);
        }
        if (currentChar === ',') {
            const startLine = this.line;
            const startColumn = this.column;
            this.nextChar();
            return new Token(Symbols[','], ',', startLine, startColumn);
        }
        if (currentChar === '.') {
            const startLine = this.line;
            const startColumn = this.column;
            this.nextChar();
            return new Token(Symbols['.'], '.', startLine, startColumn);
        }

        // Si el carácter no es reconocido, se reporta error léxico
        this.errors.push(new Error(
            'LEXICAL',
            `Carácter no reconocido: '${currentChar}'`,
            this.line,
            this.column
        )); 
        this.nextChar();
        return this.getNextToken();
    }

    // S1: Reconocimiento de identificadores y palabras reservadas.
    S1(buffer, startLine, startColumn) {
        while (this.position < this.code.length) {
            const nextChar = this.peekChar();
            if (Character.isLetter(nextChar) || Character.isDigit(nextChar) || nextChar === '_') {
                buffer += this.nextChar();
            } else {
                break;
            }
        }
        // Verifica si es palabra reservada o identificador
        if (ReservedWords[buffer]) {
            return new Token(ReservedWords[buffer], buffer, startLine, startColumn);
        } else {
            return new Token('IDENTIFIER', buffer, startLine, startColumn);
        }
    }

    // S2: Reconocimiento de números enteros y posible transición a decimales.
    S2(buffer, startLine, startColumn) {
        while (this.position < this.code.length) {
            const nextChar = this.peekChar();
            if (Character.isDigit(nextChar)) {
                buffer += this.nextChar();
            } else {
                break;
            }
        }
        // Si sigue un punto, es un número decimal
        if (this.position < this.code.length && this.peekChar() === '.') {
            buffer += this.nextChar();
            return this.S3(buffer, startLine, startColumn);
        }
        return new Token('INTEGER', buffer, startLine, startColumn);
    }

    // S3: Verifica que después del punto haya al menos un dígito (decimal válido).
    S3(buffer, startLine, startColumn) {
        if (this.position >= this.code.length || !Character.isDigit(this.peekChar())) {
            this.errors.push(new Error(
                'LEXICAL',
                `Número decimal mal formado: '${buffer}'`,
                startLine,
                startColumn
            ));
            return null;
        }
        return this.S4(buffer, startLine, startColumn);
    }

    // S4: Acumula la parte decimal del número.
    S4(buffer, startLine, startColumn) {
        while (this.position < this.code.length) {
            const nextChar = this.peekChar();
            if (Character.isDigit(nextChar)) {
                buffer += this.nextChar();
            } else {
                break;
            }
        }
        return new Token('DECIMAL', buffer, startLine, startColumn);
    }

    // S5: Reconocimiento de cadenas de texto (entre comillas dobles).
    S5(buffer, startLine, startColumn) {
        while (this.position < this.code.length) {
            const nextChar = this.peekChar();
            if (nextChar === '"') {
                buffer += this.nextChar();
                return this.S6(buffer, startLine, startColumn);
            }
            if (nextChar === '\n') {
                this.errors.push(new Error(
                    'LEXICAL',
                    `Cadena no cerrada: ${buffer}`,
                    startLine,
                    startColumn
                ))
                return null;
            }
            buffer += this.nextChar();
        }
        // Si termina el archivo sin cerrar la cadena
        this.errors.push(new Error(
            'LEXICAL',
            `Cadena no cerrada: ${buffer}`,
            startLine,
            startColumn
        ))
        return null;
    }

    // S6: Estado de aceptación de cadena. Elimina las comillas del valor.
    S6(buffer, startLine, startColumn) {
        const value = buffer.substring(1, buffer.length - 1);
        return new Token('STRING', value, startLine, startColumn);
    }

    // S7: Reconocimiento de caracteres (char) tras la comilla simple de apertura.
    S7(buffer, startLine, startColumn) {
        if (this.position >= this.code.length) {
            this.errors.push(new Error(
                'LEXICAL',
                `Carácter no cerrado: ${buffer}`,
                startLine,
                startColumn
            ));
            return null;
        }
        const nextChar = this.peekChar();
        if (nextChar === "\n") {
            this.errors.push(new Error(
                'LEXICAL',
                `Carácter no cerrado: ${buffer}`,
                startLine,
                startColumn
            ));
            return null;
        }
        buffer += this.nextChar();
        return this.S8(buffer, startLine, startColumn);
    }

    // S8: Espera la comilla simple de cierre para el carácter.
    S8(buffer, startLine, startColumn) {
        if (this.position >= this.code.length) {
            this.errors.push(new Error(
                'LEXICAL',
                `Carácter no cerrado: ${buffer}`,
                startLine,
                startColumn
            ));
            return null;
        }
        const nextChar = this.peekChar();
        if (nextChar === "'") {
            buffer += this.nextChar();
            return this.S9(buffer, startLine, startColumn);
        }
        this.errors.push(new Error(
            'LEXICAL',
            `Carácter no cerrado: ${buffer}`,
            startLine,
            startColumn
        ));
        return null;
    }

    // S9: Estado de aceptación de carácter. Elimina las comillas del valor.
    S9(buffer, startLine, startColumn) {
        const value = buffer.substring(1, buffer.length - 1);
        return new Token('CHAR', value, startLine, startColumn);
    }

    // S10: Reconocimiento de operador '+' o '++'.
    S10(buffer, startLine, startColumn) {
        if (this.position < this.code.length && this.peekChar() === '+') {
            buffer += this.nextChar();
            return this.S11(buffer, startLine, startColumn);
        }
        return new Token(Symbols['+'], buffer, startLine, startColumn);
    }

    // S11: Estado de aceptación de '++'.
    S11(buffer, startLine, startColumn) {
        return new Token(Symbols['++'], buffer, startLine, startColumn);
    }

    // S12: Reconocimiento de operador '-' o '--'.
    S12(buffer, startLine, startColumn) {
        if (this.position < this.code.length && this.peekChar() === '-') {
            buffer += this.nextChar();
            return this.S13(buffer, startLine, startColumn);
        }
        return new Token(Symbols['-'], buffer, startLine, startColumn);
    }

    // S13: Estado de aceptación de '--'.
    S13(buffer, startLine, startColumn) {
        return new Token(Symbols['--'], buffer, startLine, startColumn);
    }

    // S14: Reconocimiento de '/' (división) o inicio de comentario.
    S14(buffer, startLine, startColumn) {
        if (this.position >= this.code.length) {
            return new Token(Symbols['/'], buffer, startLine, startColumn);
        }
        const nextChar = this.peekChar();
        if (nextChar === '/') {
            buffer += this.nextChar();
            this.processLineComment(buffer, startLine, startColumn);
            return null; // Los comentarios no generan tokens
        }
        if (nextChar === '*') {
            buffer += this.nextChar();
            this.processBlockComment(buffer, startLine, startColumn);
            return null;
        }
        return new Token(Symbols['/'], buffer, startLine, startColumn);
    }

    // Procesa un comentario de línea (// ...).
    processLineComment(buffer, startLine, startColumn) {
        while (this.position < this.code.length && this.peekChar() !== '\n') {
            this.nextChar();
        }
    }

    // Procesa un comentario de bloque (/* ... *).
    // Reporta error si no se cierra correctamente.
    processBlockComment(buffer, startLine, startColumn) {
        const startLineComment = startLine;
        const startColumnComment = startColumn;
        while (this.position < this.code.length) {
            const nextChar = this.peekChar();
            if (nextChar === '*') {
                this.nextChar();
                if (this.position < this.code.length && this.peekChar() === '/') {
                    this.nextChar();
                    return;
                }
                continue;
            }
            this.nextChar();
        }
        // Si termina el archivo sin cerrar el comentario
        this.errors.push(new Error(
            'LEXICAL',
            'Comentario de bloque no cerrado',
            startLineComment,
            startColumnComment
        ));
    }

    // S15: Reconocimiento de '=' o '=='.
    S15(buffer, startLine, startColumn) {
        if (this.position < this.code.length && this.peekChar() === '=') {
            buffer += this.nextChar();
            return this.S16(buffer, startLine, startColumn);
        }
        return new Token(Symbols['='], buffer, startLine, startColumn);
    }

    // S16: Estado de aceptación de '=='.
    S16(buffer, startLine, startColumn) {
        return new Token(Symbols['=='], buffer, startLine, startColumn);
    }

    // S17: Reconocimiento de '!' o '!='. Solo acepta '!=' como válido.
    S17(buffer, startLine, startColumn) {
        if (this.position < this.code.length && this.peekChar() === '=') {
            buffer += this.nextChar();
            return this.S18(buffer, startLine, startColumn);
        }
        this.errors.push(new Error(
            'LEXICAL',
            `Operador '!' mal formado, se esperaba '=' después de '!'`,
            startLine,
            startColumn
        ));
        return null;
    }

    // S18: Estado de aceptación de '!='.
    S18(buffer, startLine, startColumn) {
        return new Token(Symbols['!='], buffer, startLine, startColumn);
    }

    // S19: Reconocimiento de '>' o '>='.
    S19(buffer, startLine, startColumn) {
        if (this.position < this.code.length && this.peekChar() === '=') {
            buffer += this.nextChar();
            return this.S20(buffer, startLine, startColumn);
        }
        return new Token(Symbols['>'], buffer, startLine, startColumn);
    }

    // S20: Estado de aceptación de '>='.
    S20(buffer, startLine, startColumn) {
        return new Token(Symbols['>='], buffer, startLine, startColumn);
    }

    // S21: Reconocimiento de '<' o '<='.
    S21(buffer, startLine, startColumn) {
        if (this.position < this.code.length && this.peekChar() === '=') {
            buffer += this.nextChar();
            return this.S22(buffer, startLine, startColumn);
        }
        return new Token(Symbols['<'], buffer, startLine, startColumn);
    }

    // S22: Estado de aceptación de '<='.
    S22(buffer, startLine, startColumn) {
        return new Token(Symbols['<='], buffer, startLine, startColumn);
    }

}

export default Lexer;