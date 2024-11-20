import React, { useState, useEffect } from 'react';
import ProtocoloCategoria from './ProtocoloCategoria';
import '../../styles/Protocolos/protocolos.css';

const Protocolos = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const data = [
      {
        categoria: 'Acceso Oficina',
        protocolos: [
          {
            id: 1,
            titulo: 'Protocolo de Seguridad en la Oficina',
            descripcion: 'Cómo acceder y las medidas de seguridad en las oficinas.',
            enlace: '',
          },
          {
            id: 2,
            titulo: 'Protocolo de Ingreso para Visitantes',
            descripcion: 'Normas de acceso para visitantes y proveedores.',
            enlace: '',
          },
        ],
      },
      {
        categoria: 'Manuales de la Empresa',
        protocolos: [
          {
            id: 3,
            titulo: 'Manual de Conducta Laboral',
            descripcion: 'Políticas y normas de conducta laboral en la empresa.',
            enlace: '',
          },
          {
            id: 4,
            titulo: 'Guía de Recursos Humanos',
            descripcion: 'Recursos y guías para los empleados.',
            enlace: '',
          },
        ],
      },
    ];

    setCategorias(data);
  }, []);

  const handleDescripcionChange = (categoriaIndex, protocoloIndex, nuevaDescripcion) => {
    const updatedCategorias = [...categorias];
    updatedCategorias[categoriaIndex].protocolos[protocoloIndex].descripcion = nuevaDescripcion;
    setCategorias(updatedCategorias);
  };

  return (
    <div className="protocolos-container">
      <h1>Protocolos de la Empresa</h1>
      {categorias.map((categoria, categoriaIndex) => (
        <div key={categoriaIndex} className="categoria">
          <h2>{categoria.categoria}</h2>
          {categoria.protocolos.map((protocolo, protocoloIndex) => (
            <div key={protocolo.id} className="protocolo">
              <h3>{protocolo.titulo}</h3>
              <textarea
                value={protocolo.descripcion}
                onChange={(e) =>
                  handleDescripcionChange(categoriaIndex, protocoloIndex, e.target.value)
                }
                className="descripcion-textarea"
              />
              <a href={protocolo.enlace} target="_blank" rel="noopener noreferrer">
                {protocolo.enlace ? 'Ver Protocolo' : 'Sin enlace'}
              </a>
            </div>
          ))}
        </div>
      ))}
      <div className="file-upload">
        <input type="file" onChange={(e) => console.log('Archivo seleccionado:', e.target.files[0])} />
        <button onClick={() => console.log('Subir archivo')}>Subir Archivo</button>
      </div>
    </div>
  );
};

export default Protocolos;
