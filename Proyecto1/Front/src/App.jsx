import './css/App.css'
import { useState } from 'react';


function App() {

  const [contenido, setContenido] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setContenido(e.target.result);
    };
    reader.readAsText(file);
  };

  const analizarTorneo = async () => {
    const respuesta = await fetch('http://localhost:3200/api/archivo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenido }), // contenido es el texto del archivo
    });
    const resultado = await respuesta.json();
    // Aquí puedes mostrar resultado.tokens y resultado.errores en pantalla
    console.log(resultado);
  };

  return (
    <>
      <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
      <div className='cardTitle'>
        <h1>TourneyJS - Analizador de Torneos</h1>
      </div>
      <div className='cardButtons'>
        <button onClick={() => document.getElementById('fileInput').click()}>Cargar Archivo</button>
        <button onClick={analizarTorneo}>Analizar Torneo</button>
        <button>Generar Reporte</button>
        <button>Mostrar Bracket</button>
      </div>
      <div>
        <textarea value={contenido} className="textArea" placeholder="Contenido del archivo..." readOnly></textarea>
      </div>
    </>
  )
};

export default App; 
