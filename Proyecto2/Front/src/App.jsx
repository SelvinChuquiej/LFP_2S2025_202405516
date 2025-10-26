import { useState } from 'react';
import './css/App.css';

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
  const [pythonCode, setPythonCode] = useState('');
  const [tokens, setTokens] = useState([]);
  const [errors, setErrors] = useState([]);
  const [activeTab, setActiveTab] = useState('python');

  const analyzeTokens = async () => {
    try {
      const resp = await fetch('http://localhost:3200/api/analizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ javaCode })
      });
      const result = await resp.json();
      setTokens(result.tokens);
      setErrors(result.errors);
      setActiveTab(result.errors.length > 0 ? 'errors' : 'tokens');
    } catch (error) {
      console.error('Error analyzing tokens:', error);
    }
  };

  const clearAll = () => {
    setJavaCode('');
    setPythonCode('');
    setTokens([]);
    setErrors([]);
    setActiveTab('python');
  };

  return (
    <div className="javabridge-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="java-text">Java</span>
            <span className="bridge-arrow">→</span>
            <span className="python-text">Python</span>
            <span className="bridge-text">Bridge</span>
          </h1>
          <p className="app-subtitle">Traductor de código Java a Python - Proyecto 2 LFP</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-container">
        <div className="content-grid">
          {/* Left Column - Editor */}
          <div className="editor-column">
            {/* Java Editor */}
            <div className="code-panel">
              <div className="panel-header">
                <h3 className="panel-title">
                  <span className="icon">📝</span>
                  Código Java
                </h3>
                <button className="clear-btn" onClick={clearAll}>
                  🗑️ Limpiar
                </button>
              </div>
              <textarea value={javaCode} onChange={(e) => setJavaCode(e.target.value)} placeholder="Escribe tu código Java aquí..." className="code-editor" spellCheck="false" />
            </div>

            {/* Action Buttons*/}
            <div className="action-buttons">
              {/*}
              <button onClick={translateJavaToPython} disabled={loading || !javaCode.trim()} className="btn btn-primary">
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Traduciendo...
                  </>
                ) : (
                  <>
                    🚀 Traducir a Python
                  </>
                )}
              </button>*/}

              <button onClick={analyzeTokens} disabled={!javaCode.trim()} className="btn btn-secondary">
                🔍 Analizar Tokens
              </button>
            </div>
            {/* Results Tabs */}
            <div className="results-panel">
              <div className="tabs-header">
                <button className={`tab-btn ${activeTab === 'python' ? 'active' : ''}`} onClick={() => setActiveTab('python')}>
                  🐍 Python Traducido
                </button>
                <button className={`tab-btn ${activeTab === 'tokens' ? 'active' : ''}`} onClick={() => setActiveTab('tokens')}>
                  📋 Tokens ({tokens.length})
                </button>
                <button className={`tab-btn ${activeTab === 'errors' ? 'active' : ''}`} onClick={() => setActiveTab('errors')}>
                  {errors.length > 0 ? '❌' : '✅'} Errores ({errors.length})
                </button>
              </div>

              <div className="tabs-content">
                {/* Python Code Tab */}
                {activeTab === 'python' && (
                  <div className="tab-panel">
                    {pythonCode ? (
                      <pre className="code-output">{pythonCode}</pre>
                    ) : (
                      <div className="empty-state">
                        <div className="empty-icon">🐍</div>
                        <h4>Esperando traducción</h4>
                        <p>Presiona "Traducir a Python" para comenzar</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tokens Tab */}
                {activeTab === 'tokens' && (
                  <div className="tab-panel">
                    {tokens.length > 0 ? (
                      <div className="tokens-table">
                        <div className="table-header">
                          <span>#</span>
                          <span>Tipo</span>
                          <span>Valor</span>
                          <span>Línea</span>
                          <span>Columna</span>
                        </div>
                        <div className="table-body">
                          {tokens.map((token, index) => (
                            <div key={index} className="table-row">
                              <span className="cell index">{index + 1}</span>
                              <span className="cell type">
                                <span className="token-badge">{token.type}</span>
                              </span>
                              <span className="cell value">"{token.value}"</span>
                              <span className="cell line">{token.line}</span>
                              <span className="cell column">{token.column}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h4>No hay tokens para mostrar</h4>
                        <p>Presiona "Analizar Tokens" para ver los tokens reconocidos</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Errors Tab */}
                {activeTab === 'errors' && (
                  <div className="tab-panel">
                    {errors.length > 0 ? (
                      <div className="errors-list">
                        {errors.map((error, index) => (
                          <div key={index} className="error-item">
                            <div className="error-header">
                              <span className="error-type">{error.type}</span>
                              <span className="error-location">
                                Línea {error.line}, Columna {error.column}
                              </span>
                            </div>
                            <div className="error-message">
                              {error.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state success">
                        <div className="empty-icon">✅</div>
                        <h4>No se encontraron errores</h4>
                        <p>El código está listo para ser traducido</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="stats-column">
            <div className="stats-panel">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className={`stat-number ${tokens.length > 0 ? 'success' : 'error'}`}>
                  {tokens.length}
                </div>
                <div className="stat-label">Tokens Reconocidos</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">{errors.length > 0 ? '❌' : '✅'}</div>
                <div className={`stat-number ${errors.length > 0 ? 'error' : 'success'}`}>
                  {errors.length}
                </div>
                <div className="stat-label">Errores Encontrados</div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="info-panel">
              <h4>💡 Información</h4>
              <div className="info-content">
                <p><strong>JavaBridge</strong> convierte código Java básico a Python preservando la semántica.</p>
                <ul className="features-list">
                  <li>✅ Análisis léxico con AFD</li>
                  <li>✅ Parser manual</li>
                  <li>✅ Traducción Java→Python</li>
                  <li>✅ Reportes HTML</li>
                  <li>✅ Interfaz web</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2025 JavaBridge - Proyecto 2 Lenguajes Formales y de Programación</p>
      </footer>
    </div>
  );
}

export default App;