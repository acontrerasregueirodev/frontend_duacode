import React, { useState, useEffect } from 'react';
import FileUpload from '../Kiosko/FileUpload';  
import '../../styles/Protocolos/protocolos.css'; 

const Protocolos = () => {
  const [protocolos, setProtocolos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nombre, setNombre] = useState(''); // Estado para el nombre del archivo

  useEffect(() => {
    if (nombre) {
      setLoading(true);
      fetch(`https://belami.pythonanywhere.com/media/${nombre}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error('Expected JSON response, but got something else');
          }
          return response.json();
        })
        .then((data) => {
          setProtocolos(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [nombre]);

  const handleFileUploadSuccess = (newFile) => {
    setNombre(newFile.name); // Asigna el nombre del archivo al estado
    setProtocolos((prevProtocolos) => [
      ...prevProtocolos,
      {
        nombre: newFile.name,
        descripcion: newFile.descripcion || '', 
        enlace: newFile.url || '', 
      }
    ]);
  };

  if (loading) {
    return <p>Loading protocols...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="protocolos-container">
      <h1>Protocolos de la Empresa</h1>
      
      {protocolos.length > 0 ? (
        protocolos.map((protocolo, index) => (
          <div key={index} className="protocolo">
            <h2>{protocolo.nombre}</h2>
            <p>{protocolo.descripcion}</p>
            <p><strong>Subido el:</strong> {new Date(protocolo.fecha_subida).toLocaleString()}</p>
            {protocolo.enlace && (
              <a href={protocolo.enlace} target="_blank" rel="noopener noreferrer">
                Ver Protocolo
              </a>
            )}
          </div>
        ))
      ) : (
        <p>No hay protocolos disponibles.</p>
      )}

      <FileUpload onFileUploadSuccess={handleFileUploadSuccess} />
    </div>
  );
};

export default Protocolos;
