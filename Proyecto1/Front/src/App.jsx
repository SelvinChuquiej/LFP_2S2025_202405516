import './css/App.css'
import { useState } from 'react';


function App() {

  const [contenido, setContenido] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      setContenido(e.target.result)
      await fetch('http://localhost:3200/api/archivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: e.target.result }),
      });
    };
    reader.readAsText(file);
  };

  return (
    <>
      <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
      <div className='cardTitle'>
        <h1>TourneyJS - Analizador de Torneos</h1>
      </div>
      <div className='cardButtons'>
        <button onClick={() => document.getElementById('fileInput').click()}>Cargar Archivo</button>
        <button>Analizar Torneo</button>
        <button>Generar Reporte</button>
        <button>Mostrar Bracket</button>
      </div>
      <div>
        <textarea value={contenido} className="textArea" placeholder="Contenido del archivo..." readOnly></textarea>
      </div>
    </>
  )
}

export default App
