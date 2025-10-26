export class JavaToPythonTranslator {
    constructor() {
        // Almacena el código Python generado línea por línea
        this.pythonCode = [];
        // Controla el nivel de indentación para bloques
        this.indentLevel = 0;
    }

    // Traductor
    translate(ast) {
        this.pythonCode = [];
        this.indentLevel = 0;

        // Si el AST no es válido, muestra un error en el código generado
        if (!ast || !ast.classDecl) {
            this.pythonCode.push("# ERROR: No se pudo generar el AST");
            return this.pythonCode.join('\n');
        }

        this.visitProgram(ast);
        return this.pythonCode.join('\n');
    }

    // Procesa el nodo principal del programa
    visitProgram(node) {
        this.pythonCode.push('# Traducido de Java a Python');
        this.pythonCode.push(`# Clase: ${node.classDecl.name}`);
        this.pythonCode.push('');

        // Traduce el cuerpo del método main si existe
        if (node.main && node.main.body) {
            node.main.body.forEach(stmt => this.visitStatement(stmt));
        }
    }

    // Determina el tipo de sentencia y llama al método correspondiente
    visitStatement(node) {
        if (!node) return;

        switch (node.type) {
            case 'VarDecl':
                this.visitVarDecl(node);
                break;
            case 'AssignStmt':
                this.visitAssignStmt(node);
                break;
            case 'PrintStmt':
                this.visitPrintStmt(node);
                break;
            case 'IfStmt':
                this.visitIfStmt(node);
                break;
            case 'WhileStmt':
                this.visitWhileStmt(node);
                break;
            case 'BlockStmt':
                this.visitBlockStmt(node);
                break;
            case 'ExprStmt':
                this.visitExprStmt(node);
                break;
            default:
                // Si la sentencia no está soportada, se agrega un comentario en el código generado
                this.pythonCode.push(`${this.getIndent()}# Sentencia no traducida: ${node.type}`);
        }
    }

    // Traduce una declaración de variable
    visitVarDecl(node) {
        const defaultValue = this.getDefaultValue(node.varType);
        let value = defaultValue;

        // Si la variable tiene inicialización, se traduce la expresión
        if (node.init) {
            value = this.visitExpression(node.init);
        }

        this.pythonCode.push(`${this.getIndent()}${node.name} = ${value}  # Declaracion: ${node.varType}`);
    }

    // Traduce una asignación
    visitAssignStmt(node) {
        const value = this.visitExpression(node.expr);
        this.pythonCode.push(`${this.getIndent()}${node.name} = ${value}`);
    }

    // Traduce una sentencia de impresión
    visitPrintStmt(node) {
        const value = this.visitExpression(node.expr);

        // Si es una cadena, no se aplica str() adicional
        if (node.expr.type === 'StringLiteral') {
            this.pythonCode.push(`${this.getIndent()}print(${value})`);
        } else {
            this.pythonCode.push(`${this.getIndent()}print(str(${value}))`);
        }
    }

    // Traduce una sentencia if-else
    visitIfStmt(node) {
        const condition = this.visitExpression(node.cond);
        this.pythonCode.push(`${this.getIndent()}if ${condition}:`);

        this.indentLevel++;
        this.visitStatement(node.thenStmt);
        this.indentLevel--;

        if (node.elseStmt) {
            this.pythonCode.push(`${this.getIndent()}else:`);
            this.indentLevel++;
            this.visitStatement(node.elseStmt);
            this.indentLevel--;
        }
    }

    // Traduce un ciclo while
    visitWhileStmt(node) {
        const condition = this.visitExpression(node.cond);
        this.pythonCode.push(`${this.getIndent()}while ${condition}:`);

        this.indentLevel++;
        this.visitStatement(node.body);
        this.indentLevel--;
    }

    // Traduce un bloque de sentencias
    visitBlockStmt(node) {
        node.statements.forEach(stmt => this.visitStatement(stmt));
    }

    // Traduce una expresión que se usa como sentencia (por ejemplo, incremento)
    visitExprStmt(node) {
        if (node.expr) {
            const exprStr = this.visitExpression(node.expr);
            // Solo se genera código si la expresión tiene efectos secundarios
            if (this.hasSideEffects(node.expr)) {
                this.pythonCode.push(`${this.getIndent()}${exprStr}`);
            }
        }
    }

    // Traduce una expresión y devuelve su representación en Python
    visitExpression(node) {
        if (!node) return 'None';

        switch (node.type) {
            case 'Identifier':
                return node.name;

            case 'IntLiteral':
                return node.value.toString();

            case 'DoubleLiteral':
                return node.value.toString();

            case 'CharLiteral':
                return `'${node.value}'`;

            case 'StringLiteral':
                return `"${node.value}"`;

            case 'BooleanLiteral':
                return node.value ? 'True' : 'False';

            case 'BinaryExpr':
                const left = this.visitExpression(node.left);
                const right = this.visitExpression(node.right);

                // Si ambos operandos son enteros, usa división entera
                if (node.op === '/' && this.isIntegerDivision(node.left, node.right)) {
                    return `(${left} // ${right})`;
                }

                // Si hay concatenación de cadenas, convierte ambos a string
                if (node.op === '+' && this.needsStringConversion(node.left, node.right)) {
                    return `str(${left}) + str(${right})`;
                }

                return `(${left} ${this.mapOperator(node.op)} ${right})`;

            case 'UnaryPreExpr':
                const preOp = this.mapOperator(node.op);
                if (preOp === '+ 1') return `${node.name} += 1`;
                if (preOp === '- 1') return `${node.name} -= 1`;
                return `${preOp}${node.name}`;

            case 'UnaryPostExpr':
                const postOp = this.mapOperator(node.op);
                if (postOp === '+ 1') return `${node.name} += 1`;
                if (postOp === '- 1') return `${node.name} -= 1`;
                return `${node.name}${postOp}`;

            case 'AssignExpr':
                return `${node.name} = ${this.visitExpression(node.expr)}`;

            default:
                return `# Expresión no soportada: ${node.type}`;
        }
    }

    // Devuelve el valor por defecto para cada tipo de dato Java
    getDefaultValue(javaType) {
        const defaults = {
            'INT_TYPE': '0',
            'DOUBLE_TYPE': '0.0',
            'CHAR_TYPE': "''",
            'STRING_TYPE': '""',
            'BOOLEAN_TYPE': 'False',
            'int': '0',
            'double': '0.0',
            'char': "''",
            'String': '""',
            'boolean': 'False'
        };
        return defaults[javaType] || 'None';
    }

    // Mapea los operadores de Java a sus equivalentes en Python
    mapOperator(op) {
        const operatorMap = {
            // Operadores aritméticos
            'PLUS': '+',
            'MINUS': '-',
            'MULTIPLY': '*',
            'DIVIDE': '/',

            // Operadores de comparación
            'EQUAL_EQUAL': '==',
            'NOT_EQUAL': '!=',
            'GREATER': '>',
            'LESS': '<',
            'GREATER_EQUAL': '>=',
            'LESS_EQUAL': '<=',

            // Operadores simples
            '+': '+',
            '-': '-',
            '*': '*',
            '/': '/',
            '==': '==',
            '!=': '!=',
            '>': '>',
            '<': '<',
            '>=': '>=',
            '<=': '<=',

            // Incremento y decremento
            '++': '+ 1',
            '--': '- 1',
            'INCREMENT': '+= 1',
            'DECREMENT': '-= 1'
        };
        return operatorMap[op] || op;
    }

    // Determina si ambos operandos son enteros para usar división entera
    isIntegerDivision(leftNode, rightNode) {
        const leftType = this.getExpressionType(leftNode);
        const rightType = this.getExpressionType(rightNode);
        return leftType === 'int' && rightType === 'int';
    }

    // Verifica si es necesario convertir a string para concatenar
    needsStringConversion(leftNode, rightNode) {
        const leftType = this.getExpressionType(leftNode);
        const rightType = this.getExpressionType(rightNode);

        return (leftType !== 'String' && rightType === 'String') ||
            (leftType === 'String' && rightType !== 'String');
    }

    // Determina el tipo de una expresión
    getExpressionType(node) {
        if (!node) return 'unknown';

        switch (node.type) {
            case 'IntLiteral': return 'int';
            case 'DoubleLiteral': return 'double';
            case 'CharLiteral': return 'char';
            case 'StringLiteral': return 'String';
            case 'BooleanLiteral': return 'boolean';
            case 'Identifier': return 'unknown';
            default: return 'unknown';
        }
    }

    // Indica si una expresión tiene efectos secundarios (como asignaciones o incrementos)
    hasSideEffects(expr) {
        return expr.type === 'UnaryPreExpr' ||
            expr.type === 'UnaryPostExpr' ||
            expr.type === 'AssignExpr';
    }

    // Devuelve la indentación actual según el nivel de bloque
    getIndent() {
        return '    '.repeat(this.indentLevel);
    }
}