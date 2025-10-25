import { Token, ReservedWords, Symbols } from "../models/token";
import { Error, ErrorTypes } from "../models/error";
import { Character } from "../utils/character";

import class Lexer {
    constructor(input) {
        this.code = code
        this.position = 0
        this.line = 1
        this.column = 1
        this.tokens = []
        this.errors = []
    }

    // Método principal
    analyze() {
        let token
        while ((token = this.getNextToken()).type !== "EOF") {
            if (token) {
                this.tokens.push(token)
            }
        }
        return { tokens: this.tokens, errors: this.errors, success: this.errors.length === 0}
    }

    // Obtener el siguiente token
    getNextToken() {
        return this.stateS0()
    }

    // Obtener el siguiente carácter sin avanzar la posición
    peekChar(){
        if(this.position >= this.code.length) {
            return null
        }
        return this.code[this.position]
    }

    // Obtener el siguiente carácter y avanzar la posición
    nextChar(){
        if(this.position >= this.code.length) {
            return null
        }
        const char = this.code[this.position]
        this.position++
        if(char === '\n'){
            this.line++
            this.column = 1
        } else {
            this.column++
        }
        return char
    }

    // Saltar espacios en blanco
    skipWhitespace(){
        while(this.position < this.code.length){
            const char = this.peekChar()
            if(Character.isWhitespace(char)){
                this.nextChar()
            } else {
                break
            }
        }
    }

    // Estados
    #S0() {
        while (this.#pos_char < this.#input.length) {
            this.#next_char = this.#input[this.#pos_char];

            if (Character.isAlpha(this.#next_char) || this.#next_char === '_') {
                this.#initBuffer(this.#next_char);
                return this.#S1();

            }
        }
    }
}