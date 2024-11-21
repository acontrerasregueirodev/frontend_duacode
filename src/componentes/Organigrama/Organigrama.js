import React, { useEffect, useState } from "react";
import Empleado from "./Empleado";
import axios from "axios";
import "../../styles/Organigrama/organigrama.css";

const Organigrama = () => {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await axios.get("https://belami.pythonanywhere.com/api/empleados/");
        const data = response.data;

        // Ordenar empleados por rango (de mayor a menor)
        const empleadosOrdenados = data.sort((a, b) => b.rango - a.rango);

        setEmpleados(empleadosOrdenados);
      } catch (error) {
        console.error("Error al obtener los empleados:", error);
      }
    };

    fetchEmpleados();
  }, []);

  return (
    <div className="organigrama-container">
      <h1>Organigrama de la Empresa</h1>
      <div className="empleados-grid">
        {empleados.length > 0 ? (
          empleados.map((empleado, index) => (
            <Empleado key={index} empleado={empleado} />
          ))
        ) : (
          <p>Cargando empleados...</p>
        )}
      </div>
    </div>
  );
};

export default Organigrama;