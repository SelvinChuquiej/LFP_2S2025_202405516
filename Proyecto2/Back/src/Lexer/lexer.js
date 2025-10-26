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

    // Método principal: Ejecuta el análisis léxico hasta el final del código
    analyze() {
        let token;
        while ((token = this.getNextToken()).type !== "EOF") {
            if (token) {
                this.tokens.push(token);
            }
        } 
        return { tokens: this.tokens, errors: this.errors, success: this.errors.length === 0 }; 
    }

    // Obtener el siguiente token: Inicia el proceso del AFD
    getNextToken() {
        return this.S0();
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

    // Estados AFD
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
            let buffer = this.nextChar(); // Consumir el primer carácter
            return this.S1(buffer, startLine, startColumn);
        }

        // δ(dígito, S0) = S2 - NÚMEROS ENTEROS
        if (Character.isDigit(currentChar)) {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar(); // Consumir el primer dígito
            return this.S2(buffer, startLine, startColumn);
        }

        // δ(", S0) = S5 - CADENAS
        if (currentChar === '"') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar(); // Consumir la comilla de apertura
            return this.S5(buffer, startLine, startColumn);
        }

        // δ(', S0) = S7 - CARACTERES
        if (currentChar === "'") {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar(); // Consumir la comilla de apertura
            return this.S7(buffer, startLine, startColumn);
        }

        // δ(+, S0) = S10 - OPERADOR + o ++
        if (currentChar === '+') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S10(buffer, startLine, startColumn);
        }

        // δ(-, S0) = S12 - OPERADOR - o --
        if (currentChar === '-') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S12(buffer, startLine, startColumn);
        }

        // δ(*, S0) = ACEPTACIÓN INMEDIATA (Operador de Multiplicación)
        if (currentChar === '*') {
            const startLine = this.line;
            const startColumn = this.column;
            this.nextChar();
            return new Token('MULTIPLY', '*', startLine, startColumn);
        }

        // δ(/, S0) = S14 - OPERADOR / y COMENTARIOS
        if (currentChar === '/') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S14(buffer, startLine, startColumn);
        }

        // δ(=, S0) = S15 - OPERADOR = o ==
        if (currentChar === '=') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S15(buffer, startLine, startColumn);
        }

        // δ(!, S0) = S17 - OPERADOR ! (Solo acepta != en Java)
        if (currentChar === '!') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S17(buffer, startLine, startColumn);
        }

        // δ(>, S0) = S19 - OPERADOR > o >=
        if (currentChar === '>') {
            const startLine = this.line;
            const startColumn = this.column;
            let buffer = this.nextChar();
            return this.S19(buffer, startLine, startColumn);
        }

        // δ(<, S0) = S21 - OPERADOR < o <=
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
        this.nextChar(); // Consumir el carácter erróneo y continuar
        return this.getNextToken();
    }

    // S1: RECONOCIMIENTO DE IDENTIFICADORES Y PALABRAS RESERVADAS
    S1(buffer, startLine, startColumn) {
        // Continuar acumulando caracteres mientras sean letras, dígitos o guion bajo
        while (this.position < this.code.length) {
            const nextChar = this.peekChar();
            // δ(letra|dígito|_, S1) = S1
            if (Character.isLetter(nextChar) || Character.isDigit(nextChar) || nextChar === '_') {
                buffer += this.nextChar();
            } else {
                // Si encontramos algo diferente, terminamos el token
                break;
            }
        }

        // Estado de Aceptación: Determinar si es una Palabra Reservada o un Identificador
        if (ReservedWords[buffer]) {
            return new Token(ReservedWords[buffer], buffer, startLine, startColumn);
        } else {
            return new Token('IDENTIFIER', buffer, startLine, startColumn);
        }
    }

    // S2: RECONOCIMIENTO DE NÚMEROS ENTEROS
    S2(buffer, startLine, startColumn) {
        // Continuar acumulando dígitos
        while (this.position < this.code.length) {
            const nextChar = this.peekChar();
            // δ(dígito, S2) = S2
            if (Character.isDigit(nextChar)) {
                buffer += this.nextChar();
            } else {
                break;
            }
        }

        // δ(., S2) = S3 - Transición a números decimales
        if (this.position < this.code.length && this.peekChar() === '.') {
            buffer += this.nextChar(); // Consumir el punto
            return this.S3(buffer, startLine, startColumn);
        }

        // Estado de Aceptación: Es un número entero (INTEGER)
        return new Token('INTEGER', buffer, startLine, startColumn);
    }

    // S3: ESTADO INTERMEDIO PARA NÚMEROS DECIMALES (Verificar dígito después del punto)
    S3(buffer, startLine, startColumn) {
        // Si no hay más caracteres o el siguiente no es un dígito: ERROR LÉXICO (ej: "123.")
        if (this.position >= this.code.length || !Character.isDigit(this.peekChar())) {
            this.errors.push(new Error(
                'LEXICAL',
                `Número decimal mal formado: '${buffer}'`,
                startLine,
                startColumn
            ));
            return null; // Devolver null para que el análisis continúe
        }

        // δ(dígito, S3) = S4
        return this.S4(buffer, startLine, startColumn);
    }


    // S4: RECONOCIMIENTO DE LA PARTE DECIMAL
    S4(buffer, startLine, startColumn) {
        // Continuar acumulando dígitos de la parte decimal
        while (this.position < this.code.length) {
            const nextChar = this.peekChar();
            // δ(dígito, S4) = S4
            if (Character.isDigit(nextChar)) {
                buffer += this.nextChar();
            } else {
                break;
            }
        }

        // Estado de Aceptación: Es un número decimal (DECIMAL)
        return new Token('DECIMAL', buffer, startLine, startColumn);
    }

    // S5: RECONOCIMIENTO DE CADENAS DE TEXTO (STRING)
    S5(buffer, startLine, startColumn) {
        while (this.position < this.code.length) {
            const nextChar = this.peekChar();

            // δ(", S5) = S6 - Cierre de cadena
            if (nextChar === '"') {
                buffer += this.nextChar(); // Consumir la comilla de cierre
                return this.S6(buffer, startLine, startColumn);
            }

            // ERROR LÉXICO: Salto de línea antes de cerrar la comilla
            if (nextChar === '\n') {
                this.errors.push(new Error(
                    'LEXICAL',
                    `Cadena no cerrada: ${buffer}`,
                    startLine,
                    startColumn
                ))
                return null;
            }

            // δ(cualquier_otro_carácter, S5) = S5
            buffer += this.nextChar();
        }

        // ERROR LÉXICO: Fin de archivo (EOF) antes de cerrar la comilla
        this.errors.push(new Error(
            'LEXICAL',
            `Cadena no cerrada: ${buffer}`,
            startLine,
            startColumn
        ))
        return null;
    }

    // S6: ESTADO DE ACEPTACIÓN DE CADENA
    S6(buffer, startLine, startColumn) {
        // El valor del token es el contenido sin las comillas (ej: "texto" -> texto)
        const value = buffer.substring(1, buffer.length - 1);
        return new Token('STRING', value, startLine, startColumn);
    }

    // S7: RECONOCIMIENTO DE CARACTERES (CHAR) - Después de la primera comilla simple
    S7(buffer, startLine, startColumn) {
        // ERROR LÉXICO: Fin de archivo antes del carácter
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

        // ERROR LÉXICO: Salto de línea después de la comilla inicial
        if (nextChar === "\n") {
            this.errors.push(new Error(
                'LEXICAL',
                `Carácter no cerrado: ${buffer}`,
                startLine,
                startColumn
            ));
            return null;
        }

        // δ(cualquier_carácter, S7) = S8 - Acumular el carácter interno
        buffer += this.nextChar();
        return this.S8(buffer, startLine, startColumn);
    }

    // S8: RECONOCIMIENTO DE CARACTERES (CHAR) - Esperando la comilla de cierre
    S8(buffer, startLine, startColumn) {
        // ERROR LÉXICO: Fin de archivo antes de cerrar
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

        // δ(', S8) = S9 - Cierre de carácter
        if (nextChar === "'") {
            buffer += this.nextChar(); // Consumir la comilla de cierre
            return this.S9(buffer, startLine, startColumn);
        }

        // ERROR LÉXICO: Se esperaba ' pero se encontró otro carácter (ej: 'ab')
        this.errors.push(new Error(
            'LEXICAL',
            `Carácter no cerrado: ${buffer}`,
            startLine,
            startColumn
        ));
        return null;
    }

    // S9: ESTADO DE ACEPTACIÓN DE CARÁCTER
    S9(buffer, startLine, startColumn) {
        // El valor del token es el contenido sin las comillas (ej: 'a' -> a)
        const value = buffer.substring(1, buffer.length - 1);
        return new Token('CHAR', value, startLine, startColumn);
    }

    // S10: RECONOCIMIENTO DE OPERADOR '+' o '++'
    S10(buffer, startLine, startColumn) {
        // δ(+, S10) = S11 - Es un '++'
        if (this.position < this.code.length && this.peekChar() === '+') {
            buffer += this.nextChar(); // Consumir el segundo '+'
            return this.S11(buffer, startLine, startColumn);
        }
        // Estado de Aceptación: Es un '+' simple (suma)
        return new Token(Symbols['+'], buffer, startLine, startColumn);
    }

    // S11: ESTADO DE ACEPTACIÓN DE '++'
    S11(buffer, startLine, startColumn) {
        return new Token(Symbols['++'], buffer, startLine, startColumn);
    }

    // S12: RECONOCIMIENTO DE OPERADOR '-' o '--'
    S12(buffer, startLine, startColumn) {
        // δ(-, S12) = S13 - Es un '--'
        if (this.position < this.code.length && this.peekChar() === '-') {
            buffer += this.nextChar(); // Consumir el segundo '-'
            return this.S13(buffer, startLine, startColumn);
        }
        // Estado de Aceptación: Es un '-' simple (resta)
        return new Token(Symbols['-'], buffer, startLine, startColumn);
    }

    // S13: ESTADO DE ACEPTACIÓN DE '--'
    S13(buffer, startLine, startColumn) {
        return new Token(Symbols['--'], buffer, startLine, startColumn);
    }

    // S14: RECONOCIMIENTO DE OPERADOR '/' O INICIO DE COMENTARIO
    S14(buffer, startLine, startColumn) {
        // Si llegamos al final del archivo, es un operador de división simple
        if (this.position >= this.code.length) {
            return new Token(Symbols['/'], buffer, startLine, startColumn);
        }

        const nextChar = this.peekChar();

        // δ(/, S14) = COMENTARIO DE LÍNEA (//)
        if (nextChar === '/') {
            buffer += this.nextChar(); // Consumir el segundo '/'
            this.processLineComment(buffer, startLine, startColumn);
            return null // Los comentarios no generan tokens, volver a S0
        }

        // δ(*, S14) = COMENTARIO DE BLOQUE (/*)
        if (nextChar === '*') {
            buffer += this.nextChar(); // Consumir el '*'
            this.processBlockComment(buffer, startLine, startColumn);
            return null; // Los comentarios no generan tokens, volver a S0
        }

        // Estado de Aceptación: Es un '/' simple (división)
        return new Token(Symbols['/'], buffer, startLine, startColumn);
    }

    // Función para saltar todo el contenido de un comentario de línea (//)
    processLineComment(buffer, startLine, startColumn) {
        // Seguir avanzando hasta encontrar un salto de línea o el fin del código
        while (this.position < this.code.length && this.peekChar() !== '\n') {
            this.nextChar();
        }
    }

    // Función para procesar un comentario de bloque (/* ... */)
    processBlockComment(buffer, startLine, startColumn) {
        const startLineComment = startLine;
        const startColumnComment = startColumn;

        // Bucle para buscar la secuencia de cierre "*/"
        while (this.position < this.code.length) {
            const nextChar = this.peekChar();

            // Buscar el '*'
            if (nextChar === '*') {
                this.nextChar(); // Consumir el '*'

                // Si después del '*' viene un '/'
                if (this.position < this.code.length && this.peekChar() === '/') {
                    this.nextChar(); // Consumir el '/'
                    return; // Comentario de bloque cerrado
                }
                // Si no viene '/', continuar buscando la secuencia
                continue;
            }

            // Consumir cualquier otro carácter (incluyendo \n)
            this.nextChar();
        }

        // ERROR LÉXICO: Fin de archivo antes de cerrar el comentario de bloque
        this.errors.push(new Error(
            'LEXICAL',
            'Comentario de bloque no cerrado',
            startLineComment,
            startColumnComment
        ));
    }

    // S15: RECONOCIMIENTO DE OPERADOR '=' o '=='
    S15(buffer, startLine, startColumn) {
        // δ(=, S15) = S16 - Es un '=='
        if (this.position < this.code.length && this.peekChar() === '=') {
            buffer += this.nextChar(); // Consumir el segundo '='
            return this.S16(buffer, startLine, startColumn);
        }

        // Estado de Aceptación: Es un '=' simple (asignación)
        return new Token(Symbols['='], buffer, startLine, startColumn);
    }

    // S16: ESTADO DE ACEPTACIÓN DE '==' (igualdad)
    S16(buffer, startLine, startColumn) {
        return new Token(Symbols['=='], buffer, startLine, startColumn);
    }

    // S17: RECONOCIMIENTO DE OPERADOR '!' o '!='
    S17(buffer, startLine, startColumn) {
        // δ(=, S17) = S18 - Es un '!='
        if (this.position < this.code.length && this.peekChar() === '=') {
            buffer += this.nextChar(); // Consumir el '='
            return this.S18(buffer, startLine, startColumn);
        }

        // ERROR LÉXICO: Se encontró '!' sin un '=' después (operador lógico unario '!' no soportado)
        this.errors.push(new Error(
            'LEXICAL',
            `Operador '!' mal formado, se esperaba '=' después de '!'`,
            startLine,
            startColumn
        ));
        return null;
    }

    // S18: ESTADO DE ACEPTACIÓN DE '!=' (diferente de)
    S18(buffer, startLine, startColumn) {
        return new Token(Symbols['!='], buffer, startLine, startColumn);
    }

    // S19: RECONOCIMIENTO DE OPERADOR '>' o '>='
    S19(buffer, startLine, startColumn) {
        // δ(=, S19) = S20 - Es un '>='
        if (this.position < this.code.length && this.peekChar() === '=') {
            buffer += this.nextChar(); // Consumir el '='
            return this.S20(buffer, startLine, startColumn);
        }

        // Estado de Aceptación: Es un '>' simple (mayor que)
        return new Token(Symbols['>'], buffer, startLine, startColumn);
    }

    // S20: ESTADO DE ACEPTACIÓN DE '>=' (mayor o igual que)
    S20(buffer, startLine, startColumn) {
        return new Token(Symbols['>='], buffer, startLine, startColumn);
    }

    // S21: RECONOCIMIENTO DE OPERADOR '<' o '<='
    S21(buffer, startLine, startColumn) {
        // δ(=, S21) = S22 - Es un '<='
        if (this.position < this.code.length && this.peekChar() === '=') {
            buffer += this.nextChar(); // Consumir el '='
            return this.S22(buffer, startLine, startColumn);
        }

        // Estado de Aceptación: Es un '<' simple (menor que)
        return new Token(Symbols['<'], buffer, startLine, startColumn);
    }

    // S22: ESTADO DE ACEPTACIÓN DE '<=' (menor o igual que)
    S22(buffer, startLine, startColumn) {
        return new Token(Symbols['<='], buffer, startLine, startColumn);
    }

}

export default Lexer;