export class Character {
    static isLetter(char) {
        if (!char) return false;
        const code = char.charCodeAt(0);
        return (code >= 65 && code <= 90) || (code >= 97 && code <= 122); 
    }

    static isDigit(char) {
        if (!char) return false;
        const code = char.charCodeAt(0);
        return code >= 48 && code <= 57;
    }

    static isAlphanumeric(char) {
        return this.isAlpha(char) || this.isDigit(char);
    }

    static isWhitespace(char) {
        return char === ' ' || char === '\t' || char === '\n' || char === '\r';
    }
}