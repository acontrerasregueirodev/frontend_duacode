import React, { useState, useEffect } from 'react';
import FileUpload from '../Kiosko/FileUpload';  
import '../../styles/Protocolos/protocolos.css'; 

const Protocolos = () => {
  const [protocolos, setProtocolos] = useState([]);

  useEffect(() => {
    fetch('https://belami.pythonanywhere.com/upload/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la respuesta de la red');
        }
        return response.text(); // Obtener el HTML como texto
      })
      .then((html) => {
        // Parsear el HTML para extraer los datos necesarios
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Selecciona las filas que contienen los protocolos
        const rows = [...doc.querySelectorAll('div')].filter((div) =>
          div.textContent.includes('Nombre:')
        );

        // Extraer datos de cada fila
        const data = rows.map((row) => {
          const nombre = row.textContent.match(/Nombre:\s(.+?)\n/)[1];
          const descripcion = row.textContent.match(/Descripción:\s(.+?)\n/)[1];
          const fecha = row.textContent.match(/Subido el:\s(.+)/)[1];
          return { nombre, descripcion, fecha };
        });

        setProtocolos(data);
      })
      .catch((error) => {
        console.error('Error al obtener los protocolos:', error);
      });
  }, []);

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

      <FileUpload onFileUploadSuccess={(newFile) => {
        setProtocolos((prev) => [
          ...prev,
          {
            nombre: `uploaded_files/${newFile.name}`,
            descripcion: newFile.descripcion || '',
            fecha: new Date().toLocaleString(),
          },
        ]);
      }} />
    </div>
  );
};

export default Protocolos;
