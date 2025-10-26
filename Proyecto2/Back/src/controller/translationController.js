'use strict'

import { Lexer } from '../Lexer/lexer.js';
import { Parser } from '../Parser/parser.js';
import { JavaToPythonTranslator } from '../Translator/translator.js';

export function analizarLexico(req, res) {
    const { javaCode } = req.body;
    if (!javaCode) {
        return res.status(400).json({ error: 'No code provided' });
    }

    const lexer = new Lexer(javaCode);
    const { tokens, errors: lexErrors } = lexer.analyze();

    const parser = new Parser(tokens);
    const { ast, errors: synErrors, success: parseSuccess } = parser.parse();

    return res.status(200).json({
        tokens: tokens || [],
        errors: [...(lexErrors || []), ...(synErrors || [])],
        success: (parseSuccess && lexErrors.length === 0)
    });
}

export function traducirJavaAPython(req, res) {
    const { javaCode } = req.body;
    if (!javaCode) {
        return res.status(400).json({ error: 'No code provided' });
    }

    try {
        // 1. Análisis Léxico
        const lexer = new Lexer(javaCode);
        const lexerResult = lexer.analyze();

        if (!lexerResult.success) {
            return res.json({
                success: false,
                pythonCode: null,
                errors: lexerResult.errors
            });
        }

        // 2. Análisis Sintáctico
        const parser = new Parser(lexerResult.tokens);
        const parserResult = parser.parse();

        if (!parserResult.success) {
            return res.json({
                success: false,
                pythonCode: null,
                errors: parserResult.errors
            });
        }

        // 3. Traducción
        const translator = new JavaToPythonTranslator();
        const pythonCode = translator.translate(parserResult.ast);

        return res.json({
            success: true,
            pythonCode: pythonCode,
            errors: []
        });

    } catch (error) {
        return res.json({
            success: false,
            pythonCode: null,
            errors: [{ type: 'RUNTIME', message: error.message }]
        });
    }
}