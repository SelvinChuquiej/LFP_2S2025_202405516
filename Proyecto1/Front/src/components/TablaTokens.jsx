import React from 'react';
import '../css/TablaTokens.css';

const TablaTokens = ({ tokens }) => (
    <div className="contenedor-tabla">
        <table className="tabla-tokens">
            <thead>
                <tr>
                    <th>Lexema</th>
                    <th>Tipo</th>
                    <th>Fila</th>
                    <th>Columna</th>
                </tr>
            </thead>
            <tbody>
                {tokens.map((token, idx) => (
                    <tr key={idx}>
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