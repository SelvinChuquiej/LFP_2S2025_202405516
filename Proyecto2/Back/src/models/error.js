export class Error {
    constructor(type, description, line, column) {
        this.type = type
        this.description = description
        this.line = line
        this.column = column
    }
}