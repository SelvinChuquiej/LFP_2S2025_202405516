import { useState } from "react";
import "./css/App.css";

function App() {
  const [javaCode, setJavaCode] = useState(`public class MiPrograma {
    public static void main(String[] args) {
        int numero = 10;
        String mensaje = "Hola Mundo";
        
        if (numero > 5) {
            System.out.println(mensaje);
        }
        
        for (int i = 0; i < 3; i++) {
            System.out.println("Iteración: " + i);
        }
    }
  }`);

  const [pythonCode, setPythonCode] = useState("");
  const [tokens, setTokens] = useState([]);

  const analyzeTokens = async () => {
    try {
      const resp = await fetch("http://localhost:3200/api/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ javaCode }),
      });
      const result = await resp.json();
      setTokens(result.tokens);
    } catch (error) {
      console.error("Error analyzing tokens:", error);
    }
  };

  const clearAll = () => {
    if (window.confirm("¿Seguro que deseas limpiar el editor?")) {
      setJavaCode("");
      setPythonCode("");
      setTokens([]);
    }
  };

  const handleOpenFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setJavaCode(event.target.result);
    reader.readAsText(file);
  };

  const handleSaveJava = () => {
    const blob = new Blob([javaCode], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "codigo.java";
    link.click();
  };

  const handleSavePython = () => {
    if (!pythonCode.trim()) return alert("No hay traducción disponible");
    const blob = new Blob([pythonCode], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "codigo_traducido.py";
    link.click();
  };

  const handleViewTokens = () => {
    if (!tokens.length) return alert("No hay tokens generados.");
    let html = `<table border="1"><tr><th>#</th><th>Tipo</th><th>Valor</th><th>Línea</th><th>Columna</th></tr>`;
    tokens.forEach((t, i) => {
      html += `<tr><td>${i + 1}</td><td>${t.type}</td><td>${t.value}</td><td>${t.line}</td><td>${t.column}</td></tr>`;
    });
    html += `</table>`;
    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "reporte_tokens.html";
    link.click();
  };

  const handleTranslate = async () => {
    try {
      const resp = await fetch("http://localhost:3200/api/traducir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ javaCode }),
      });
      const result = await resp.json();
      setPythonCode(result.python || "");
    } catch (err) {
      console.error("Error translating:", err);
      alert("Error al traducir el código.");
    }
  };

  return (
    <div className="javabridge-app">

      <nav className="navbar">
        <ul className="menu">
          <li>
            ARCHIVO ▾
            <ul className="dropdown">
              <li onClick={clearAll}>🆕 Nuevo</li>
              <li>
                <label htmlFor="fileInput">📂 Abrir (.java)</label>
                <input id="fileInput" type="file" accept=".java" hidden onChange={handleOpenFile} />
              </li>
              <li onClick={handleSaveJava}>💾 Guardar (.java)</li>
              <li onClick={handleSavePython}>🐍 Guardar Python</li>
            </ul>

          </li>

          <li>
            TRADUCIR ▾
            <ul className="dropdown">
              <li onClick={handleTranslate}>⚙️ Generar Traducción</li>
              <li onClick={analyzeTokens}>🔍 Analizar Tokens</li>
              <li onClick={handleViewTokens}>📋 Ver Tokens</li>
            </ul>
          </li>

          <li>
            AYUDA ▾
            <ul className="dropdown">
              <li
                onClick={() =>
                  alert("JavaBridge v1.0 — Desarrollado por Steven López, UMG 2025")
                }
              >
                ℹ️ Acerca de
              </li>
            </ul>
          </li> 
        </ul>
        <div className="logo">☕ JavaBridge</div>
      </nav>

      <main className="main-layout">

        <section className="panel">
          <h3>☕ Código Java</h3>
          <textarea
            value={javaCode}
            onChange={(e) => setJavaCode(e.target.value)}
            className="code-editor"
            placeholder="Escribe tu código Java aquí..."
          />
          <div className="button-group">
            <button className="btn btn-primary" onClick={handleTranslate}>
              ⚙️ Traducir
            </button>
            <button className="btn btn-secondary" onClick={analyzeTokens}>
              🔍 Tokens
            </button>
            <button className="btn btn-outline" onClick={handleViewTokens}>
              📋 Ver Tokens
            </button>
            <button className="btn btn-danger" onClick={clearAll}>
              🗑️ Limpiar
            </button>
          </div>
        </section>

        <section className="panel">
          <h3>🐍 Código Python Traducido</h3>
          <textarea
            value={pythonCode}
            readOnly
            className="code-editor"
            placeholder="Aquí aparecerá el código traducido..."
          />
          <div className="button-group">
            <button className="btn btn-save" onClick={handleSavePython}>
              💾 Guardar Python
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          © 2025 JavaBridge - Proyecto 2 | Lenguajes Formales y de
          Programación | Selvin Raúl Chuquiej Andrade
        </p>
      </footer>
    </div>
  );
}

export default App;
