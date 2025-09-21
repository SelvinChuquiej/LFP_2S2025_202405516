import React from 'react';
import '../css/Tablas.css';

const Reportes = ({ brackets }) => (
    <div className="contenedor-tabla">
        <h2>Reporte Bracket Eliminación:</h2>
        <table className="tabla-bracket">
            <thead>
                <tr>
                    <th>Fase</th>
                    <th>Partido</th>
                    <th>Resultado</th>
                    <th>Ganador</th>
                </tr>
            </thead>
            <tbody>
                {brackets.map((bracket, idx) => (
                    <tr key={idx}>
                        <td>{bracket.fase}</td>
                        <td>{bracket.partido}</td>
                        <td>{bracket.resultado}</td>
                        <td>{bracket.ganador}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <h2>Reporte Estadisticas por Equipo:</h2>
    </div >
);

export default Reportes;