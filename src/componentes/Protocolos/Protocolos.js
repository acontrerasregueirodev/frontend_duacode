import React, { useState, useEffect } from "react";
import ProtocoloCategoria from "./ProtocoloCategoria";
import "../../styles/Protocolos/protocolos.css"; // Asegúrate de tener los estilos aquí.

const Protocolos = () => {
  const [categorias, setCategorias] = useState([]);
  const [descripcion, setDescripcion] = useState(""); // Agregamos el estado para la descripción.

  useEffect(() => {
    const data = [
      {
        categoria: "Acceso Oficina",
        protocolos: [
          {
            id: 1,
            titulo: "Protocolo de Seguridad en la Oficina",
            descripcion:
              "Cómo acceder y las medidas de seguridad en las oficinas.",
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
            descripcion:
              "Políticas y normas de conducta laboral en la empresa.",
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
    updatedCategorias[categoriaIndex].protocolos[protocoloIndex].enlace =
      newFile.url || ""; // Actualiza el enlace
    setCategorias(updatedCategorias);
  };

  return (
    <div className="protocolos-container">
      <h1>Protocolos de la Empresa</h1>
      {categorias.map((categoria, categoriaIndex) => (
        <ProtocoloCategoria
          key={categoriaIndex}
          categoria={categoria}
          categoriaIndex={categoriaIndex}
          onFileUploadSuccess={handleFileUploadSuccess}
        />
      ))}
      <div className="file-upload">
        <input
          type="file"
          onChange={(e) =>
            console.log("Archivo seleccionado:", e.target.files[0])
          }
        />
        <button onClick={() => console.log("Subir archivo")}>
          Subir Archivo
        </button>
        <div>
          <label htmlFor="descripcion">Descripción del Proyecto:</label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Protocolos;
