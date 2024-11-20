import React, { useState } from 'react';

const ProtocoloCard = ({ protocolo, categoriaIndex, protocoloIndex, onFileUploadSuccess }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://belami.pythonanywhere.com/', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      // Llama a la función para actualizar el estado del protocolo con el enlace subido
      onFileUploadSuccess(categoriaIndex, protocoloIndex, result);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  return (
    <div className="protocolo-card">
      <h3>{protocolo.titulo}</h3>
      <p>{protocolo.descripcion}</p>
      <a
        href={protocolo.enlace || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={`protocolo-enlace ${protocolo.enlace ? '' : 'disabled'}`}
      >
        Ver Documento
      </a>
      
    </div>
  );
};

export default ProtocoloCard;
