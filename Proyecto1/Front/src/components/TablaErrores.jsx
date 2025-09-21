import React from 'react';
import '../css/Tablas.css';

const TablaErrores = ({ errores }) => (
    <div className="contenedor-tabla">
        <h2>Errores Lexicos: {errores.length}</h2>
        <table className="tabla-tokens">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Lexema</th>
                    <th>Tipo de Error</th>
                    <th>Descripcion</th>
                    <th>Fila</th>
                    <th>Columna</th>
                </tr>
            </thead>
            <tbody>
                {errores.map((error, idx) => (
                    <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{error.lexema}</td>
                        <td>{error.tipo}</td>
                        <td>{error.descripcion}</td>
                        <td>{error.fila}</td>
                        <td>{error.columna}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div >
);

export default TablaErrores;