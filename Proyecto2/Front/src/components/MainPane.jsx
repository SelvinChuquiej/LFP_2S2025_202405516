import React from "react";
import ReporteTokens from "./ReporteTokens";

function MainPanel({
    javaCode,
    setJavaCode,
    pythonCode,
    tokens,
    errors,
    activeView,
    handleTranslate,
    handleViewTokens,
    analyzeTokens,
    clearAll,
    handleSavePython
}) {
    if (activeView === "reporte") {
        return <ReporteTokens tokens={tokens} errors={errors} />;
    }

    return (
        <main className="main-layout">
            <section className="panel">
                <h3>☕ Código Java</h3>
                <textarea value={javaCode}  onChange={(e) => setJavaCode(e.target.value)} className="code-editor" placeholder="Escribe tu código Java aquí..."/>
                <div className="button-group">
                    <button className="btn btn-primary" onClick={handleTranslate}>
                        ⚙️ Traducir
                    </button>
                    <button className="btn btn-secondary" onClick={analyzeTokens}>
                        🔍 Tokens
                    </button>
                    <button className="btn btn-outline" onClick={handleViewTokens}>
                        📋 Ver Tokens y Errores
                    </button>
                    <button className="btn btn-danger" onClick={clearAll}>
                        🗑️ Limpiar
                    </button>
                </div>
            </section>

            <section className="panel">
                <h3>🐍 Código Python Traducido</h3>
                <textarea value={pythonCode} readOnly className="code-editor" placeholder="Aquí aparecerá el código traducido..."/>
                <div className="button-group">
                    <button className="btn btn-save" onClick={handleSavePython}>
                        💾 Guardar Python
                    </button>
                </div>
            </section>
        </main>
    );
}

export default MainPanel;
