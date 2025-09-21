import './css/App.css'
import { useState } from 'react';
import TablaTokens from './components/TablaTokens';
import TablaErrores from './components/TablaErrores';


function App() {

  const [modoVista, setModoVista] = useState('textarea');
  const [contenido, setContenido] = useState('');
  const [tokens, setTokens] = useState([]);
  const [errores, setErrores] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setContenido(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleCargarArchivo = () => {
    setTokens([]);
    setErrores([]);
    setContenido('');
    setModoVista('textarea');
    document.getElementById('fileInput').value = '';
    document.getElementById('fileInput').click();
  };

  const analizarTorneo = async (tipo) => {
    const respuesta = await fetch('http://localhost:3200/api/archivo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenido }), // contenido es el texto del archivo
    });
    const resultado = await respuesta.json();
    if (tipo === 'tokens') {
      setTokens(resultado.tokens);
      setErrores([]);
      setModoVista('tokens');
    } else if (tipo === 'errores') {
      setErrores(resultado.errores);
      setTokens([]);
      setModoVista('errores');
    }
  };

  return (
    <>
      <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
      <div className='cardTitle'>
        <h1>TourneyJS - Analizador de Torneos</h1>
      </div>
      <div className='cardButtons'>
        <button onClick={(handleCargarArchivo)}>Cargar Archivo</button>
        <button onClick={() => analizarTorneo('tokens')}>Analizar Torneo</button>
        <button onClick={() => analizarTorneo('errores')}>Analizar Errores</button>
        <button>Generar Reporte</button>
        <button>Mostrar Bracket</button>
      </div >
      <div>
        <div>
          {modoVista === 'textarea' && (<textarea value={contenido} className="textArea" placeholder="Contenido del archivo..." readOnly />)}
          {modoVista === 'tokens' && <TablaTokens tokens={tokens} />}
          {modoVista === 'errores' && <TablaErrores errores={errores} />}
        </div>
      </div>
    </>
  )
};

export default App; 
