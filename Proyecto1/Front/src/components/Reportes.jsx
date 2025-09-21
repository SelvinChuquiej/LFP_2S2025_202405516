import React from 'react';
import '../css/Tablas.css';

const Reportes = ({ brackets, estadisticas, goleadores, torneos }) => (
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
        <table className="tabla-estadisticas">
            <thead>
                <tr>
                    <th>Equipo</th>
                    <th>Partidos Jugados</th>
                    <th>Ganados</th>
                    <th>Perdidos</th>
                    <th>Goles a Favor</th>
                    <th>Goles en Contra</th>
                    <th>Diferencia de Goles</th>
                    <th>Fase Alcanzada</th>
                </tr>
            </thead>
            <tbody>
                {estadisticas.map((estadistica, idx) => (
                    <tr key={idx}>
                        <td>{estadistica.equipo}</td>
                        <td>{estadistica.partidosJugados}</td>
                        <td>{estadistica.ganados}</td>
                        <td>{estadistica.perdidos}</td>
                        <td>{estadistica.golesAFavor}</td>
                        <td>{estadistica.golesEnContra}</td>
                        <td>{estadistica.diferencia}</td>
                        <td>{estadistica.faseAlcanzada}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <h2>Reporte Goleadores:</h2>
        <table className="tabla-goleadores">
            <thead>
                <tr>
                    <th>Posicion</th>
                    <th>Jugador</th>
                    <th>Equipo</th>
                    <th>Goles</th>
                    <th>Minutos de Gol</th>
                </tr>
            </thead>
            {goleadores.map((goleador, idx) => (
                <tr key={idx}>
                    <td>{goleador.posicion}</td>
                    <td>{goleador.jugador}</td>
                    <td>{goleador.equipo}</td>
                    <td>{goleador.goles}</td>
                    <td>{goleador.minutos}</td>
                </tr>
            ))}
            <tbody>
            </tbody>
        </table>

        <h2>Reporte Informacion general torneo:</h2>
        <table className="tabla-goleadores">
            <thead>
                <tr>
                    <th>Estadistica</th>
                    <th>Valor</th>
                </tr>
            </thead>
            {torneos.map((torneo, idx) => (
                <tr key={idx}>
                    <td>{torneo.estadistica}</td>
                    <td>{torneo.valor}</td>
                </tr>
            ))}
            <tbody>
            </tbody>
        </table>
    </div >
);

export default Reportes;