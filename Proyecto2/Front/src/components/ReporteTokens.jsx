import React from "react";
import "../css/App.css";

function ReporteTokens({ tokens = [], errors = [] }) {
    if (!tokens.length && !errors.length)
        return (
            <section className="report-section">
                <h3>📋 Reporte de Tokens</h3>
                <p>No hay tokens ni errores generados aún.</p>
            </section>
        );

    const lexicalErrors = errors.filter((e) => e.type === "LEXICAL");
    const syntaxErrors = errors.filter((e) => e.type === "SINTACTICO");

    return (
        <section className="report-section">
            <h3>📋 Reporte de Tokens</h3>

            {tokens.length > 0 ? (
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tipo</th>
                            <th>Valor</th>
                            <th>Línea</th>
                            <th>Columna</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokens.map((t, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{t.type}</td>
                                <td>{t.value}</td>
                                <td>{t.line}</td>
                                <td>{t.column}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No se encontraron tokens.</p>
            )}

            {lexicalErrors.length > 0 && (
                <>
                    <h3 style={{ marginTop: "1rem", color: "#dc2626" }}>❌ Errores Léxicos</h3>
                    <table className="report-table error-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tipo</th>
                                <th>Descripción</th>
                                <th>Línea</th>
                                <th>Columna</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lexicalErrors.map((err, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{err.type}</td>
                                    <td>{err.description}</td>
                                    <td>{err.line}</td>
                                    <td>{err.column}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {syntaxErrors.length > 0 && (
                <>
                    <h3 style={{ marginTop: "1rem", color: "#ea580c" }}>⚠️ Errores Sintácticos</h3>
                    <table className="report-table error-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tipo</th>
                                <th>Descripción</th>
                                <th>Línea</th>
                                <th>Columna</th>
                            </tr>
                        </thead>
                        <tbody>
                            {syntaxErrors.map((err, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{err.type}</td>
                                    <td>{err.description}</td>
                                    <td>{err.line}</td>
                                    <td>{err.column}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </section>
    );
}

export default ReporteTokens;
