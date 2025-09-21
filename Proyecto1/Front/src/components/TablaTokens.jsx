import React from 'react';
import '../css/Tablas.css';

const TablaTokens = ({ tokens }) => (
    <div className="contenedor-tabla">
        <h2>Tokens Extraidos: {tokens.length}</h2>
        <table className="tabla-errores">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Lexema</th>
                    <th>Tipo</th>
                    <th>Fila</th>
                    <th>Columna</th>
                </tr>
            </thead>
            <tbody>
                {tokens.map((token, idx) => (
                    <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{token.lexema}</td>
                        <td>{token.tipo}</td>
                        <td>{token.fila}</td>
                        <td>{token.columna}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div >
);

export default TablaTokens;