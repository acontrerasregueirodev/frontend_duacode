import React, { useState, useEffect } from "react";
import ProtocoloCategoria from "./ProtocoloCategoria";
import "../../styles/Protocolos/protocolos.css";

const Protocolos = () => {
  const [categorias, setCategorias] = useState([]);
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    const data = [
      {
        categoria: "Acceso Oficina",
        protocolos: [
          {
            id: 1,
            titulo: "Protocolo de Seguridad en la Oficina",
            descripcion: "Cómo acceder y las medidas de seguridad en las oficinas.",
            enlace: "",
          },
          {
            id: 2,
            titulo: "Protocolo de Ingreso para Visitantes",
            descripcion: "Normas de acceso para visitantes y proveedores.",
            enlace: "",
          },
        ],
      },
      {
        categoria: "Manuales de la Empresa",
        protocolos: [
          {
            id: 3,
            titulo: "Manual de Conducta Laboral",
            descripcion: "Políticas y normas de conducta laboral en la empresa.",
            enlace: "",
          },
          {
            id: 4,
            titulo: "Guía de Recursos Humanos",
            descripcion: "Recursos y guías para los empleados.",
            enlace: "",
          },
        ],
      },
    ];

    setCategorias(data);
  }, []);

  const handleFileUploadSuccess = (categoriaIndex, protocoloIndex, newFile) => {
    const updatedCategorias = [...categorias];
    updatedCategorias[categoriaIndex].protocolos[protocoloIndex].enlace = newFile.url || "";
    updatedCategorias[categoriaIndex].protocolos[protocoloIndex].descripcion = newFile.descripcion || "";
    setCategorias(updatedCategorias);
  };

  const handleFileUpload = (categoriaIndex, protocoloIndex) => {
    if (!descripcion) {
      alert("Por favor, agrega una descripción antes de subir el archivo.");
      return;
    }

    const fileInput = document.querySelector(".file-upload input[type='file']");
    const file = fileInput?.files[0];

    if (file) {
      const fakeUploadedFile = {
        url: URL.createObjectURL(file),
        descripcion,
      };

      handleFileUploadSuccess(categoriaIndex, protocoloIndex, fakeUploadedFile);
      setDescripcion("");
    } else {
      alert("Por favor, selecciona un archivo.");
    }
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
              <p>{protocolo.descripcion}</p>
              {protocolo.enlace && (
                <a href={protocolo.enlace} target="_blank" rel="noopener noreferrer">
                  Ver Archivo
                </a>
              )}
              <div className="file-upload">
                <input type="file" />
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Agregar descripción"
                />
                <button onClick={() => handleFileUpload(categoriaIndex, protocoloIndex)}>
                  Subir Archivo
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Protocolos;
