'use strict'

import { Lexer } from '../Lexer/lexer.js';
import { Parser } from '../Parser/parser.js';

export function analizarLexico(req, res) {
    const { javaCode } = req.body;
    if (!javaCode) {
        return res.status(400).json({ error: 'No code provided' });
    }

    const lexer = new Lexer(javaCode);
    const {tokens, errors: lexErrors} = lexer.analyze();

    const parser = new Parser(tokens);
    const {ast, errors: synErrors, success: parseSuccess} = parser.parse();

    return res.status(200).json({
        tokens: tokens || [],
        errors: [...(lexErrors || []), ...(synErrors || [])],
        success: (parseSuccess && lexErrors.length === 0)
    });
}
