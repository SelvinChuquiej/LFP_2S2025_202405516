'use strict'

import { Lexer } from '../Lexer/lexer.js';

export function analizarLexico(req, res) {
    const { javaCode } = req.body;
    if (!javaCode) {
        return res.status(400).json({ error: 'No code provided' });
    }

    const lexer = new Lexer(javaCode);
    const lexerResult = lexer.analyze();

    return res.status(200).json({tokens: lexerResult.tokens || [], errors: lexerResult.errors || []});
}
