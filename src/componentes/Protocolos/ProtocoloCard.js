import React, { useState } from 'react';

const ProtocoloCard = ({ protocolo, categoriaIndex, protocoloIndex, onFileUploadSuccess }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) return alert('Por favor selecciona un archivo antes de subir.');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://belami.pythonanywhere.com/', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Error al subir el archivo.');
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
      alert('Hubo un problema al subir el archivo.');
    }
  };

  return (
    <div className="protocolo-card">
      <h3>{protocolo.titulo}</h3>
      <p>{protocolo.descripcion}</p>
      <a
        href={protocolo.enlace || '#'}
        target={protocolo.enlace ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className={protocolo.enlace ? 'protocolo-enlace' : 'protocolo-enlace disabled'}
      >
        {protocolo.enlace ? 'Ver Documento' : 'Documento no disponible'}
      </a>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Subir archivo</button>
    </div>
  );
};

export default ProtocoloCard;
