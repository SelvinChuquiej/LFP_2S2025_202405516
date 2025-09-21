import './css/App.css'
import { useState } from 'react';
import TablaTokens from './components/TablaTokens';


function App() {

  const [contenido, setContenido] = useState('');
  const [tokens, setTokens] = useState([]);
  const [mostrarTextarea, setMostrarTextarea] = useState(true);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setContenido(e.target.result);
      setMostrarTextarea(true); // Asegura que el textarea se muestre al cargar archivo
      setTokens([]); // Limpia la tabla al cargar nuevo archivo
    };
    reader.readAsText(file);
  };

  const handleCargarArchivo = () => {
    setTokens([]);
    setContenido('');
    setMostrarTextarea(true);
    document.getElementById('fileInput').value = '';
    document.getElementById('fileInput').click();
  };

  const analizarTorneo = async () => {
    const respuesta = await fetch('http://localhost:3200/api/archivo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenido }), // contenido es el texto del archivo
    });
    const resultado = await respuesta.json();
    // Aquí puedes mostrar resultado.tokens y resultado.errores en pantalla
    setTokens(resultado.tokens);
    setMostrarTextarea(false); // Oculta el textarea
  };

  return (
    <>
      <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
      <div className='cardTitle'>
        <h1>TourneyJS - Analizador de Torneos</h1>
      </div>
      <div className='cardButtons'>
        <button onClick={handleCargarArchivo}>Cargar Archivo</button>
        <button onClick={analizarTorneo}>Analizar Torneo</button>
        <button>Generar Reporte</button>
        <button>Mostrar Bracket</button>
      </div >
      <div>
        {mostrarTextarea ? (
          <textarea value={contenido} className="textArea" placeholder="Contenido del archivo..." readOnly></textarea>
        ) : (
          tokens.length > 0 && <TablaTokens tokens={tokens} />
        )}
      </div>
    </>
  )
};

export default App; 
