import { Token, ReservedWords, Symbols } from "../models/token";
import { Error, ErrorTypes } from "../models/error";
import { Character } from "../utils/character";

class Lexer {
    constructor(code) {
        this.code = code;
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
        this.errors = [];
    }

    // Método principal
    analyze() {
        let token;
        while ((token = this.getNextToken()).type !== "EOF") {
            if (token) {
                this.tokens.push(token);
            }
        }
    }

    // Obtener el siguiente token
    getNextToken() {
        return this.stateS0();
    }

    // Obtener el siguiente carácter sin avanzar la posición
    peekChar() {
        if (this.position >= this.code.length) {
            return null;
        }
        return this.code[this.position];
    }

    // Obtener el siguiente carácter y avanzar la posición
    nextChar() {
        if (this.position >= this.code.length) {
            return null;
        }
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

    // Saltar espacios en blanco
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

    //Estados AFD
    // S0: ESTADO INICIAL
    S0() {
        // Saltar espacios en blanco primero
        this.skipWhitespace();

        // Si llegamos al final del código
        if (this.position >= this.code.length) {
            return new Token('EOF', 'EOF', this.line, this.column);
        }

        const currentChar = this.peekChar();

        // δ(letra, S0) = S1 - IDENTIFICADORES
        if (Character.isLetter(currentChar) || currentChar === '_') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S1(buffer, startLine, startColumn);
        }

        // δ(dígito, S0) = S2 - NÚMEROS ENTEROS
        if (Character.isDigit(currentChar)) {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S2(buffer, startLine, startColumn);
        }

        // δ(", S0) = S5 - CADENAS
        if (currentChar === '"') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S5(buffer, startLine, startColumn);
        }

        // δ(', S0) = S7 - CARACTERES
        if (currentChar === "'") {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S7(buffer, startLine, startColumn);
        }

        // δ(+, S0) = S10 - OPERADOR +
        if (currentChar === '+') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S10(buffer, startLine, startColumn);
        }

        // δ(-, S0) = S12 - OPERADOR -
        if (currentChar === '-') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S12(buffer, startLine, startColumn);
        }

        // δ(*, S0) = ACEPTACIÓN INMEDIATA
        if (currentChar === '*') {
            const startLine = this.line;
            const startColumn = this.column;
            this.nextChar();
            return new Token('MULTIPLY', '*', startLine, startColumn);
        }

        // δ(/, S0) = S14 - OPERADOR / Y COMENTARIOS
        if (currentChar === '/') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S14(buffer, startLine, startColumn);
        }

        // δ(=, S0) = S15 - OPERADOR =
        if (currentChar === '=') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S15(buffer, startLine, startColumn);
        }

        // δ(!, S0) = S17 - OPERADOR !
        if (currentChar === '!') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S17(buffer, startLine, startColumn);
        }

        // δ(>, S0) = S19 - OPERADOR >
        if (currentChar === '>') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S19(buffer, startLine, startColumn);
        }

        // δ(<, S0) = S21 - OPERADOR <
        if (currentChar === '<') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S21(buffer, startLine, startColumn);
        }

        // DELIMITADORES (aceptación inmediata)
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

        // CARÁCTER NO RECONOCIDO - ERROR LÉXICO
        this.errors.push(new Error(
            'LEXICAL',
            `Carácter no reconocido: '${currentChar}'`,
            this.line,
            this.column
        ));
        this.nextChar();
        return this.getNextToken();
    }

    S1(buffer, startLine, startColumn) {
        while (this.position < this.code.length) {
            const nextChar = this.peekChar();
            if (Character.isLetter(nextChar) || Character.isDigit(nextChar) || nextChar === '_') {
                buffer += this.nextChar();
            } else {
                break;
            }
        }

        //Aceptación
        if (ReservedWords[buffer]) {
            return new Token(ReservedWords[buffer], buffer, startLine, startColumn);
        } else {
            return new Token('IDENTIFICADOR', buffer, startLine, startColumn);
        }
    }

    S2(buffer, startLine, startColumn) {
        while (this.position < this.code.length) {
            const nextChar = this.peekChar();
            if (Character.isDigit(nextChar)) {
                buffer += this.nextChar();
            } else {
                break;
            }
        }

        // δ(., S2) = S3 - NÚMEROS DECIMALES
        if (this.position < this.code.length && this.peekChar() === '.') {
            buffer += this.nextChar();
            return this.S3(buffer, startLine, startColumn);
        }

        return new Token('ENTERO', buffer, startLine, startColumn);
    }

    S3(buffer, startLine, startColumn) {
        if (this.position >= this.code.length || !Character.isDigit(this.peekChar())) {
            this.errors.push(new Error(
                'LEXICAL',
                `Número decimal mal formado: '${buffer}'`,
                startLine,
                startColumn
            ));
        }

        return this.S4(buffer, startLine, startColumn);
    }


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
        this.errors.push(new Error(
            'LEXICAL',
            `Cadena no cerrada: ${buffer}`,
            startLine,
            startColumn
        ))
        return null;
    }

    S6(buffer, startLine, startColumn) {
        const value = buffer.substring(1, buffer.length - 1);
        return new Token('CADENA', value, startLine, startColumn);
    }

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

    S9(buffer, startLine, startColumn) {
        const value = buffer.substring(1, buffer.length - 1);
        return new Token('CARACTER', value, startLine, startColumn);
    }

    S10(buffer, startLine, startColumn) {
        if (this.position < this.code.length && this.peekChar() === '+') {
            buffer += this.nextChar();
            return this.S11(buffer, startLine, startColumn);
        }
        return new Token(Symbols['+'], buffer, startLine, startColumn);
    }

    S11(buffer, startLine, startColumn) {
        return new Token(Symbols['++'], buffer, startLine, startColumn);
    }

    S12(buffer, startLine, startColumn) {
        if (this.position < this.code.length && this.peekChar() === '-') {
            buffer += this.nextChar();
            return this.S13(buffer, startLine, startColumn);
        }
        return new Token(Symbols['-'], buffer, startLine, startColumn);
    }

    S13(buffer, startLine, startColumn) {
        return new Token(Symbols['--'], buffer, startLine, startColumn);
    }

    S14(buffer, startLine, startColumn) {
        if (this.position >= this.code.length) {
            return new Token(Symbols['/'], buffer, startLine, startColumn);
        }
        const nextChar = this.peekChar();
        if (nextChar === '/') {
            buffer += this.nextChar();
            this.processLineComment(buffer, startLine, startColumn);
            return null
        }

        if (nextChar === '*') {
            buffer += this.nextChar();
            this.processBlockComment(buffer, startLine, startColumn);
            return null;
        }

        return new Token(Symbols['/'], buffer, startLine, startColumn);
    }

    processLineComment(buffer, startLine, startColumn) {
        while (this.position < this.code.length && this.peekChar() !== '\n') {
            this.nextChar();
        }
    }

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

            if (nextChar === '\n') {
                this.line++;
                this.column = 1;
                this.nextChar();
                continue;
            }

            this.nextChar();
        }

        this.errors.push(new Error(
            'LEXICAL',
            'Comentario de bloque no cerrado',
            startLineComment,
            startColumnComment
        ));
    }

    S15(buffer, startLine, startColumn) {
        if (this.position < this.code.length && this.peekChar() === '=') {
            buffer += this.nextChar();
            return this.S16(buffer, startLine, startColumn);
        }

        return new Token(Symbols['='], buffer, startLine, startColumn);
    }

    S16(buffer, startLine, startColumn) {
        return new Token(Symbols['=='], buffer, startLine, startColumn);
    }

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

    S18(buffer, startLine, startColumn) {
        return new Token(Symbols['!='], buffer, startLine, startColumn);
    }

    S19(buffer, startLine, startColumn) {
        if (this.position < this.code.length && this.peekChar() === '=') {
            buffer += this.nextChar();
            return this.S20(buffer, startLine, startColumn);
        }

        return new Token(Symbols['>'], buffer, startLine, startColumn);
    }

    S20(buffer, startLine, startColumn) {
        return new Token(Symbols['>='], buffer, startLine, startColumn);
    }

    S21(buffer, startLine, startColumn) {
        if (this.position < this.code.length && this.peekChar() === '=') {
            buffer += this.nextChar();
            return this.S22(buffer, startLine, startColumn);
        }

        return new Token(Symbols['<'], buffer, startLine, startColumn);
    }

    S22(buffer, startLine, startColumn) {
        return new Token(Symbols['<='], buffer, startLine, startColumn);
    }

}

export default Lexer;