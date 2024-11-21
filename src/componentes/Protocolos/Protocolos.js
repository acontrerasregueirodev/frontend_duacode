import React, { useState, useEffect } from 'react';
import FileUpload from '../Kiosko/FileUpload';  
import '../../styles/Protocolos/protocolos.css'; 

const Protocolos = () => {
  const [protocolos, setProtocolos] = useState([]);

  useEffect(() => {
    fetch('https://belami.pythonanywhere.com/upload/')
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
      })
      .catch((error) => {
        console.error('Error al obtener los protocolos:', error);
      });
  }, []);
  

  const handleFileUploadSuccess = (newFile) => {
    setProtocolos((prevProtocolos) => [
      ...prevProtocolos,
      {
        titulo: newFile.name,
        descripcion: newFile.descripcion || '', 
        enlace: newFile.url || '', 
      }
    ]);
  };

  return (
    <div className="protocolos-container">
      <h1>Protocolos de la Empresa</h1>
      
      {protocolos.length > 0 ? (
        protocolos.map((protocolo, index) => (
          <div key={index} className="protocolo">
            <h2>{protocolo.nombre}</h2>
            <p>{protocolo.descripcion}</p>
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
