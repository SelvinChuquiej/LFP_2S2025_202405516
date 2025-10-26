import { useState } from "react";
import "./css/App.css";
import MainPanel from "./components/MainPane.jsx";
import ReporteTokens from "./components/ReporteTokens.jsx";

function App() {
  const [javaCode, setJavaCode] = useState("");
  const [pythonCode, setPythonCode] = useState("");
  const [tokens, setTokens] = useState([]);
  const [errors, setErrors] = useState([]);
  const [activeView, setActiveView] = useState("editor");

  const analyzeTokens = async () => {
    try {
      const resp = await fetch("http://localhost:3200/api/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ javaCode }),
      });

      if (!resp.ok) {
        throw new Error(`Error ${resp.status}: ${resp.statusText}`);
      }

      const result = await resp.json();
      setTokens(result.tokens);
      setErrors(result.errors || []);
    } catch (error) {
      console.error("Error analyzing tokens:", error);
    }
  };

  const clearAll = () => {
    if (window.confirm("¿Seguro que deseas limpiar el editor?")) {
      setJavaCode("");
      setPythonCode("");
      setTokens([]);
      setErrors([]);
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
              <li>🐍 Guardar Python</li>
            </ul>
          </li>
          <li>
            TRADUCIR ▾
            <ul className="dropdown">
              <li onClick={handleTranslate}>⚙️ Generar Traducción</li>
              <li onClick={() => setActiveView("reporte")}>📋 Ver Tokens y Errores</li>
              <li onClick={analyzeTokens}>🔍 Analizar Tokens</li>
              <li onClick={() => setActiveView("editor")}>🧩 Volver al Editor</li>
            </ul>
          </li>
          <li>
            AYUDA ▾
            <ul className="dropdown">
              <li onClick={() => alert("JavaBridge v1.0 — Desarrollado por Selvin Raul Chuquiej Andrade")}>
                ℹ️ Acerca de
              </li>
            </ul>
          </li>
        </ul>
        <div className="logo">☕ JavaBridge</div>
      </nav>

      {activeView === "editor" && (
        <MainPanel
          javaCode={javaCode}
          setJavaCode={setJavaCode}
          pythonCode={pythonCode}
          setPythonCode={setPythonCode}
          tokens={tokens}
          errors={errors}
          activeView={activeView}
          handleTranslate={handleTranslate}
          handleViewTokens={() => setActiveView("reporte")}
          analyzeTokens={analyzeTokens}
          clearAll={clearAll}
        />
      )}

      {activeView === "reporte" && (
        <ReporteTokens tokens={tokens} errors={errors} />
      )}

      <footer className="footer">
        <p>
          © 2025 JavaBridge - Proyecto 2 | Lenguajes Formales y de Programación | Selvin Raúl Chuquiej Andrade
        </p>
      </footer>
    </div>
  );
}

export default App;
