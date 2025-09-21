import './css/App.css'
import { useState } from 'react';
import TablaTokens from './components/TablaTokens';
import TablaErrores from './components/TablaErrores';
import Reportes from './components/Reportes';


function App() {

  const [modoVista, setModoVista] = useState('textarea');
  const [contenido, setContenido] = useState('');
  const [tokens, setTokens] = useState([]);
  const [errores, setErrores] = useState([]);
  const [brackets, setBrackets] = useState([]);
  const [estadisticas, setEstadisticas] = useState([]);
  const [goleadores, setGoleadores] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.txt')) {
      alert('Por favor, selecciona un archivo .txt');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setContenido(e.target.result);
      setModoVista('textarea');
    };
    reader.readAsText(file);
  };

  const handleCargarArchivo = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = '';
      fileInput.click();
    }
  };

  const analizarTorneo = async (tipo) => {
    if (!contenido.trim()) {
      alert('El archivo está vacío. Por favor, carga un archivo con contenido.');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3200/api/archivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido }), // contenido es el texto del archivo
      });

      if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.statusText}`);
      }

      const resultado = await respuesta.json();

      if (tipo === 'tokens') {
        setTokens(resultado.tokens || []);
        setErrores([]);
        setModoVista('tokens');
      } else if (tipo === 'errores') {
        setErrores(resultado.errores || []);
        setTokens([]);
        setModoVista('errores');
      } else if (tipo === 'reporte') {
        setBrackets(resultado.bracket || []);
        setEstadisticas(resultado.estadisticas || []);
        setGoleadores(resultado.goleadores || []);
        setModoVista('reporte');
      } else {
        alert('Tipo de análisis desconocido.');
      }
    } catch (error) {
      console.error('Error al analizar el torneo:', error);
      alert('Ocurrió un error al analizar el torneo. Por favor, intenta de nuevo.');
    }
  }

  return (
    <>
      <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} accept=".txt" />
      <div className='cardTitle'>
        <h1>TourneyJS - Analizador de Torneos</h1>
      </div>
      <div className='cardButtons'>
        <button onClick={(handleCargarArchivo)}>Cargar Archivo</button>
        <button onClick={() => analizarTorneo('tokens')} disabled={!contenido}>Analizar Torneo</button>
        <button onClick={() => analizarTorneo('errores')} disabled={!contenido}>Analizar Errores</button>
        <button onClick={() => analizarTorneo('reporte')} disabled={!contenido}>Generar Reporte</button>
        <button disabled={!contenido}>Mostrar Bracket (Grafico)</button>
      </div >
      <div>
        <div>
          {modoVista === 'textarea' && (<textarea value={contenido} className="textArea" placeholder="Contenido del archivo..." readOnly />)}
          {modoVista === 'tokens' && <TablaTokens tokens={tokens} />}
          {modoVista === 'errores' && <TablaErrores errores={errores} />}
          {modoVista === 'reporte' && <Reportes brackets={brackets} estadisticas={estadisticas} goleadores={goleadores} />}
          
        </div>
      </div>
    </>
  )
};

export default App;


