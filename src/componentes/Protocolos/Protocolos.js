import React, { useState, useEffect } from 'react';
import FileUpload from '../Kiosko/FileUpload';
import "../../styles/Protocolos/protocolos.css";

const Protocolos = () => {
  const [protocolos, setProtocolos] = useState([]);

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
            <p><strong>Subido el:</strong> {protocolo.fecha}</p>
            {protocolo.nombre.startsWith('uploaded_files/') && (
              <a
                href={`https://belami.pythonanywhere.com/${protocolo.nombre}`}
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

      <FileUpload onFileUploadSuccess={handleFileUploadSuccess} />
    </div>
  );
};

export default Protocolos;
