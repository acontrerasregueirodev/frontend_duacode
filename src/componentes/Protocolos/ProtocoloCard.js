import React, { useState } from 'react';

const ProtocoloCard = ({ protocolo, categoriaIndex, protocoloIndex, onFileUploadSuccess }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Por favor, selecciona un archivo antes de subirlo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://belami.pythonanywhere.com/upload/', {
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
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Subir archivo</button>
    </div>
  );
};

export default ProtocoloCard;
