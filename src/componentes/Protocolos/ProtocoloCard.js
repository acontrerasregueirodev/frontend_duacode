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
      
      if (result.url) {
        onFileUploadSuccess(categoriaIndex, protocoloIndex, { 
          ...protocolo, 
          enlace: result.url, 
          descripcion: result.descripcion || protocolo.descripcion,
        });
      }
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
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Subir archivo</button>
    </div>
  );
};


export default ProtocoloCard;
