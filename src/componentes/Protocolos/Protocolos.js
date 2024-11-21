import React, { useState, useEffect } from 'react';
import ProtocoloCard from './ProtocoloCard';  
import '../../styles/Protocolos/protocolos.css';

const Protocolos = () => {
  const [protocolos, setProtocolos] = useState([]);

  useEffect(() => {
    fetch('https://belami.pythonanywhere.com/upload/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('La respuesta de la red no fue correcta');
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
          <ProtocoloCard
            key={index}
            protocolo={protocolo}
            categoriaIndex={0}
            protocoloIndex={index}
            onFileUploadSuccess={handleFileUploadSuccess}
          />
        ))
      ) : (
        <p>No hay protocolos disponibles.</p>
      )}
    </div>
  );
};

export default Protocolos;
