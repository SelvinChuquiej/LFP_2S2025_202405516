import { Error } from "./error.js";

export class SyntaxError extends Error {
    constructor(description, line, column, value = null) {
        super("SINTACTICO", description, line, column);
        this.value = value;
    }
}