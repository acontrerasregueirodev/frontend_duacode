import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './kioskogeneral.css'
const Empleado = ({ empleado }) => {
  const navigate = useNavigate(); // Obtén la función navigate

  const handleGoToPanel = () => {
    navigate('/test/empleados'); // Redirige al panel de empleados
  };

  return (
    <div key={empleado.id}>
      <img
        src={empleado.foto}
        alt={`Foto de ${empleado.nombre}`}
        className="empleado-foto"
      />
      <p>Nombre: {empleado.nombre}</p>
      <p>Puesto: {empleado.rol.nombre}</p>
      {/* Agrega más campos según sea necesario */}
      <button onClick={handleGoToPanel}>Gestionar Empleados</button> {/* Botón para ir al panel */}
    </div>
  );
};

export default Empleado;
