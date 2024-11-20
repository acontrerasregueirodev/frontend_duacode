import React, { useEffect, useState } from 'react';
import Departamento from './Departamento';
import axios from 'axios';
import '../../styles/Organigrama/organigrama.css'; // Asegúrate de tener los estilos aquí.

const Organigrama = () => {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await axios.get('https://belami.pythonanywhere.com/api/departamentos/');
        const data = response.data;

        // Ordenar empleados dentro de cada departamento por rango (de mayor a menor).
        const departamentosOrdenados = data.map((departamento) => ({
          ...departamento,
          empleados: departamento.empleados.sort((a, b) => b.rango - a.rango), // Supongamos que "rango" es un número mayor para cargos altos.
        }));

        setDepartamentos(departamentosOrdenados);
      } catch (error) {
        console.error('Error al obtener los departamentos:', error);
      }
    };

    fetchDepartamentos();
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