import React, { useState, useEffect } from 'react';
import ProtocoloCategoria from './ProtocoloCategoria';
import FileUpload from '../Kiosko/FileUpload';  // Asegúrate de importar el componente FileUpload
import '../../styles/Protocolos/protocolos.css'; // Asegúrate de tener los estilos aquí.

const Protocolos = () => {
  const [categorias, setCategorias] = useState([]);

  // Simulación de datos (esto podría venir de una API real).
  useEffect(() => {
    const data = [
      {
        categoria: 'Acceso Oficina',
        protocolos: [
          {
            titulo: 'Protocolo de Seguridad en la Oficina',
            descripcion: 'Cómo acceder y las medidas de seguridad en las oficinas.',
            enlace: '',
          },
          {
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
            titulo: 'Manual de Conducta Laboral',
            descripcion: 'Políticas y normas de conducta laboral en la empresa.',
            enlace: '',
          },
          {
            titulo: 'Guía de Recursos Humanos',
            descripcion: 'Recursos y guías para los empleados.',
            enlace: '',
          },
        ],
      },
    ];

    setCategorias(data);
  }, []);

  // Función que maneja el éxito del archivo subido
  const handleFileUploadSuccess = (newFile) => {
    // Actualizar el estado para incluir el archivo subido y la descripción del usuario
    const updatedCategorias = [...categorias];
    updatedCategorias[0].protocolos.push({ // Aquí eliges en qué categoría agregar el archivo
      titulo: newFile.name,
      descripcion: newFile.descripcion, // Descripción proporcionada por el usuario
      enlace: newFile.url || '', // Asegúrate de que el servidor responda con la URL del archivo
    });

    setCategorias(updatedCategorias);
  };

  return (
    <div className="protocolos-container">
      <h1>Protocolos de la Empresa</h1>
      
      {categorias.map((categoria, index) => (
        <ProtocoloCategoria key={index} categoria={categoria} />
      ))}

      {/* Mover FileUpload abajo */}
      <FileUpload onFileUploadSuccess={handleFileUploadSuccess} />
    </div>
  );
};

export default Protocolos;
