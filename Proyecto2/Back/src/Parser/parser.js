// parser.js
import { SyntaxError } from "../models/SyntaxError.js";
import { ReservedWords as RW, Symbols as SYM } from "../models/token.js";

/* AST helpers */
const node = (type, props = {}) => ({ type, ...props });

export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
        this.errors = [];
    }

    current() { return this.tokens[this.pos] || { type: "EOF", value: "EOF", line: -1, column: -1 }; }
    peek(n = 1) { return this.tokens[this.pos + n] || { type: "EOF", value: "EOF", line: -1, column: -1 }; }
    at(type) { return this.current().type === type; }
    match(type) { if (this.at(type)) { return this.tokens[this.pos++]; } return null; }

    expect(type, msg) {
        const t = this.current();
        if (t.type !== type) {
            this.report(t, msg || `Se esperaba '${type}'`);
            throw "sync"; // lanzar para activar sincronización
        }
        this.pos++;
        return t;
    }

    report(tok, description) {
        this.errors.push(new SyntaxError(description, tok.line, tok.column, tok.value));
    }

    synchronize() {
        // Avanza hasta ; o } (luego consume si es ;)
        while (!this.at("EOF") && !this.at(SYM[";"]) && !this.at(SYM["}"])) this.pos++;
        if (this.at(SYM[";"])) this.pos++;
    }

    parse() {
        try {
            const program = this.parseProgram();
            return { ast: program, errors: this.errors, success: this.errors.length === 0 };
        } catch (e) {
            // Solo por si alguna excepción inesperada burbujea
            return { ast: null, errors: this.errors.concat([String(e)]), success: false };
        }
    }

    /* ======== PROGRAMA OBLIGATORIO ========
  
     public class ID {
       public static void main ( String [ ] args ) {
          // statements*
       }
     }
  
    */
    parseProgram() {
        const root = node("Program", { classDecl: null, main: null });

        try {
            this.expect(RW["public"], "Se esperaba 'public' al inicio del archivo");
            this.expect(RW["class"], "Se esperaba 'class' después de 'public'");

            const id = this.expect("IDENTIFIER", "Se esperaba identificador de clase");
            const className = id.value;

            this.expect(SYM["{"], "Se esperaba '{' al abrir la clase");

            // main obligatorio y único
            const main = this.parseMainMethod();
            root.classDecl = node("ClassDecl", { name: className });
            root.main = main;

            this.expect(SYM["}"], "Se esperaba '}' al cerrar la clase");

            // No debe haber más tokens
            if (!this.at("EOF")) {
                this.report(this.current(), "Contenido extra después de cerrar la clase");
            }
        } catch (e) {
            if (e !== "sync") throw e;
            this.synchronize();
        }
        return root;
    }

    parseMainMethod() {
        // public static void main ( String [ ] args ) { statements* }
        this.expect(RW["public"], "Se esperaba 'public' para el método main");
        this.expect(RW["static"], "Se esperaba 'static' en la firma de main");
        this.expect(RW["void"], "Se esperaba 'void' en la firma de main");
        this.expect(RW["main"], "Se esperaba 'main'");

        this.expect(SYM["("], "Se esperaba '(' en la firma de main");
        this.expect(RW["String"], "Se esperaba 'String' en la firma de main");
        this.expect(SYM["["], "Se esperaba '[' en la firma de main");
        this.expect(SYM["]"], "Se esperaba ']' en la firma de main");
        this.expect(RW["args"], "Se esperaba 'args' en la firma de main");
        this.expect(SYM[")"], "Se esperaba ')' para cerrar la firma de main");

        this.expect(SYM["{"], "Se esperaba '{' para abrir el cuerpo de main");

        const body = [];
        while (!this.at("EOF") && !this.at(SYM["}"])) {
            const stmt = this.parseStatement();
            if (stmt) body.push(stmt);
        }

        this.expect(SYM["}"], "Se esperaba '}' para cerrar el cuerpo de main");
        return node("MainMethod", { body });
    }

    /* ======== SENTENCIAS ========
  
       Declaración: (int|double|char|String|boolean) id (= expr)? ;
       Asignación : IDENTIFIER = expr ;
       Print     : System . out . println ( expr ) ;
       If        : if ( expr ) stmt (else stmt)?
       While     : while ( expr ) stmt
       For       : for ( init ; cond ; post ) stmt
       Bloque    : { statements* }
  
    */
    parseStatement() {
        try {
            const t = this.current();

            // Bloque
            if (this.at(SYM["{"])) return this.parseBlock();

            // If
            if (this.at(RW["if"])) return this.parseIf();

            // While
            if (this.at(RW["while"])) return this.parseWhile();

            // For
            if (this.at(RW["for"])) return this.parseFor();

            // Print
            if (this.at(RW["System"])) return this.parsePrint();

            // Declaración de variable
            if (this.isTypeToken(t.type)) return this.parseVarDecl();

            // Asignación
            if (t.type === "IDENTIFIER" && this.peek().type === SYM["="]) {
                return this.parseAssignment();
            }

            // Vacía / error
            this.report(t, "Sentencia no reconocida");
            throw "sync";
        } catch (e) {
            if (e !== "sync") throw e;
            this.synchronize();
            return null;
        }
    }

    isTypeToken(tt) {
        return (
            tt === RW["int"] ||
            tt === RW["double"] ||
            tt === RW["char"] ||
            tt === RW["String"] ||
            tt === RW["boolean"]
        );
    }

    parseBlock() {
        this.expect(SYM["{"], "Se esperaba '{' para abrir bloque");
        const statements = [];
        while (!this.at("EOF") && !this.at(SYM["}"])) {
            const s = this.parseStatement();
            if (s) statements.push(s);
        }
        this.expect(SYM["}"], "Se esperaba '}' para cerrar bloque");
        return node("BlockStmt", { statements });
    }

    parseVarDecl() {
        const typeTok = this.current(); this.pos++;
        const id = this.expect("IDENTIFIER", "Se esperaba identificador en la declaración");

        let init = null;
        if (this.match(SYM["="])) {
            init = this.parseExpression();
        }
        this.expect(SYM[";"], "Se esperaba ';' al final de la declaración");
        return node("VarDecl", { varType: typeTok.type, name: id.value, init });
    }

    parseAssignment() {
        const id = this.expect("IDENTIFIER", "Se esperaba identificador para asignación");
        this.expect(SYM["="], "Se esperaba '=' en asignación");
        const expr = this.parseExpression();
        this.expect(SYM[";"], "Se esperaba ';' al final de la asignación");
        return node("AssignStmt", { name: id.value, expr });
    }

    parsePrint() {
        // System . out . println ( expr ) ;
        this.expect(RW["System"], "Se esperaba 'System'");
        this.expect(SYM["."], "Se esperaba '.'");
        this.expect(RW["out"], "Se esperaba 'out'");
        this.expect(SYM["."], "Se esperaba '.'");
        this.expect(RW["println"], "Se esperaba 'println'");
        this.expect(SYM["("], "Se esperaba '('");
        const expr = this.parseExpression();
        this.expect(SYM[")"], "Se esperaba ')'");
        this.expect(SYM[";"], "Se esperaba ';'");
        return node("PrintStmt", { expr });
    }

    parseIf() {
        this.expect(RW["if"], "Se esperaba 'if'");
        this.expect(SYM["("], "Se esperaba '(' en if");
        const cond = this.parseExpression();
        this.expect(SYM[")"], "Se esperaba ')'");
        const thenStmt = this.parseStatement();
        let elseStmt = null;
        if (this.match(RW["else"])) {
            elseStmt = this.parseStatement();
        }
        return node("IfStmt", { cond, thenStmt, elseStmt });
    }

    parseWhile() {
        this.expect(RW["while"], "Se esperaba 'while'");
        this.expect(SYM["("], "Se esperaba '(' en while");
        const cond = this.parseExpression();
        this.expect(SYM[")"], "Se esperaba ')'");
        const body = this.parseStatement();
        return node("WhileStmt", { cond, body });
    }

    parseFor() {
        this.expect(RW["for"], "Se esperaba 'for'");
        this.expect(SYM["("], "Se esperaba '(' en for");

        // init: puede ser declaración o asignación o ; vacío
        let init = null;
        if (!this.at(SYM[";"])) {
            if (this.isTypeToken(this.current().type)) {
                init = this.parseVarDecl(); // esta ya consume ';'
            } else {
                init = this.parseAssignment();
            }
        } else {
            this.expect(SYM[";"], "Se esperaba ';' tras init en for");
        }

        // cond: puede ser vacío
        let cond = null;
        if (!this.at(SYM[";"])) cond = this.parseExpression();
        this.expect(SYM[";"], "Se esperaba ';' tras cond en for");

        // post: puede ser vacío
        let post = null;
        if (!this.at(SYM[")"])) {
            // soportemos ++/-- o asignación simple como expresión
            post = this.parsePostExpr(); // no lleva ';'
        }
        this.expect(SYM[")"], "Se esperaba ')' al cerrar el for");

        const body = this.parseStatement();

        // Desazúcar: for(init;cond;post){body} => { init; while(cond){ body; post; } }
        const whileBody = [];
        if (body.type === "BlockStmt") {
            whileBody.push(...body.statements);
        } else {
            whileBody.push(body);
        }
        if (post) whileBody.push(node("ExprStmt", { expr: post }));

        return node("BlockStmt", {
            statements: [
                ...(init ? [init] : []),
                node("WhileStmt", {
                    cond: cond || node("BooleanLiteral", { value: true }),
                    body: node("BlockStmt", { statements: whileBody })
                })
            ]
        });
    }

    parsePostExpr() {
        // IDENT ( '++' | '--' ) | asignación (IDENT = expr)
        const id = this.expect("IDENTIFIER", "Se esperaba identificador en la parte post del for");
        const t = this.current().type;
        if (t === SYM["++"] || t === SYM["--"]) {
            this.pos++;
            return node("UnaryPostExpr", { op: t, name: id.value });
        }
        if (t === SYM["="]) {
            this.pos++;
            const expr = this.parseExpression();
            return node("AssignExpr", { name: id.value, expr });
        }
        this.report(this.current(), "Se esperaba '++', '--' o '=' en la parte post del for");
        throw "sync";
    }

    /* ======== EXPRESIONES (Pratt parser) ========
  
       Precedencias (mayor → menor):
         3: * /
         2: + -
         1: == != > < >= <=
    */
    parseExpression() {
        return this.parsePrecedence(1);
    }

    parsePrecedence(level) {
        if (level > 3) return this.parsePrimary();

        let left = this.parsePrecedence(level + 1);

        while (true) {
            const op = this.current().type;
            if (this.isOpAtLevel(op, level)) {
                this.pos++;
                const right = this.parsePrecedence(level + 1);
                left = node("BinaryExpr", { op, left, right });
            } else {
                break;
            }
        }
        return left;
    }

    isOpAtLevel(op, level) {
        if (level === 3) return op === SYM["*"] || op === SYM["/"];
        if (level === 2) return op === SYM["+"] || op === SYM["-"];
        if (level === 1) {
            return (
                op === SYM["=="] || op === SYM["!="] ||
                op === SYM[">"] || op === SYM["<"] ||
                op === SYM[">="] || op === SYM["<="]
            );
        }
        return false;
    }

    parsePrimary() {
        const t = this.current();

        // Literales
        if (t.type === "INTEGER") { this.pos++; return node("IntLiteral", { value: parseInt(t.value, 10) }); }
        if (t.type === "DECIMAL") { this.pos++; return node("DoubleLiteral", { value: parseFloat(t.value) }); }
        if (t.type === "CHAR") { this.pos++; return node("CharLiteral", { value: t.value }); }
        if (t.type === "STRING") { this.pos++; return node("StringLiteral", { value: t.value }); }
        if (t.type === RW["true"]) { this.pos++; return node("BooleanLiteral", { value: true }); }
        if (t.type === RW["false"]) { this.pos++; return node("BooleanLiteral", { value: false }); }

        // Identificadores
        if (t.type === "IDENTIFIER") { this.pos++; return node("Identifier", { name: t.value }); }

        // ( expr )
        if (t.type === SYM["("]) {
            this.pos++;
            const expr = this.parseExpression();
            this.expect(SYM[")"], "Se esperaba ')' para cerrar la expresión");
            return expr;
        }

        this.report(t, "Expresión no válida");
        throw "sync";
    }
}
