import React from 'react';
import ProtocoloCard from './ProtocoloCard';

const ProtocoloCategoria = ({ categoria, categoriaIndex, onFileUploadSuccess }) => {
  return (
    <div className="protocolo-categoria">
      <h2>{categoria.categoria}</h2>
      <div className="protocolo-grid">
        {categoria.protocolos.map((protocolo, protocoloIndex) => (
          <ProtocoloCard
            key={protocolo.id}
            protocolo={protocolo}
            categoriaIndex={categoriaIndex}
            protocoloIndex={protocoloIndex}
            onFileUploadSuccess={onFileUploadSuccess}
          />
        ))}
      </div>
    </div>
  );
};

export default ProtocoloCategoria;
