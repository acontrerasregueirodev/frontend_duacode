import React, { useState, useEffect } from 'react';

const Protocolos = () => {
  const [protocolos, setProtocolos] = useState([]);
  const [file, setFile] = useState(null);
  const [descripcion, setDescripcion] = useState('');

  // Obtener protocolos al cargar el componente
  useEffect(() => {
    fetch('https://belami.pythonanywhere.com/upload/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la respuesta de la red');
        }
        return response.text();
      })
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Selecciona los <li> que contienen los protocolos
        const items = [...doc.querySelectorAll('ul li')];
        const data = items.map((item) => {
          const nombre = item.querySelector('strong:nth-of-type(1)').nextSibling.textContent.trim();
          const descripcion = item.querySelector('strong:nth-of-type(2)').nextSibling.textContent.trim();
          const fecha = item.querySelector('strong:nth-of-type(3)').nextSibling.textContent.trim();

          return { nombre, descripcion, fecha };
        });

        setProtocolos(data);
      })
      .catch((error) => {
        console.error('Error al obtener los protocolos:', error);
      });
  }, []);

  // Manejar la selección de archivo
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Manejar la descripción del archivo
  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
  };

  // Subir archivo al servidor
  const handleFileUpload = async () => {
    if (!file) {
      alert('Por favor, selecciona un archivo antes de subirlo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('descripcion', descripcion);

    try {
      const response = await fetch('https://belami.pythonanywhere.com/upload/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

      // Recargar protocolos después de subir el archivo
      const result = await response.text();
      console.log('Archivo subido:', result);

      setFile(null);
      setDescripcion('');
      alert('Archivo subido con éxito.');
      window.location.reload(); // Forzar recarga de protocolos
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  return (
    <div className="protocolos-container">
      <h1>Protocolos de la Empresa</h1>

      {/* Formulario para subir archivos */}
      <div className="file-upload-form">
        <h2>Subir archivo</h2>
        <input type="file" onChange={handleFileChange} />
        <textarea
          placeholder="Descripción del archivo"
          value={descripcion}
          onChange={handleDescripcionChange}
        />
        <button onClick={handleFileUpload}>Subir</button>
      </div>

      {/* Lista de protocolos */}
      <h2>Archivos Subidos</h2>
      {protocolos.length > 0 ? (
        protocolos.map((protocolo, index) => (
          <div key={index} className="protocolo">
            <h3>{protocolo.nombre}</h3>
            <p>{protocolo.descripcion}</p>
            <p><strong>Subido el:</strong> {protocolo.fecha}</p>
            {protocolo.nombre.startsWith('uploaded_files/') && (
              <a
                href={`https://belami.pythonanywhere.com/media/${protocolo.nombre}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver Documento
              </a>
            )}
          </div>
        ))
      ) : (
        <p>No hay protocolos disponibles.</p>
      )}
    </div>
  );
};

export default Protocolos;
