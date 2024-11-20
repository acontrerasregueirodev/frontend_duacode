import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Paneles = () => {

    const getCsrfToken = () => {
        // Obtener el token CSRF desde las cookies
        const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        return csrfToken ? csrfToken.split('=')[1] : null;
    };
    const navigate = useNavigate(); // Obtén la función navigate

  const irProyectos = () => {
    navigate('/test/proyectos'); // Redirige al panel de empleados
  };
  const irSalas = () => {
    navigate('/test/salas'); // Redirige al panel de salas
  };

    return (
        <div key={'paneles'} className="paneles">

        <h1>Acceder a Paneles de Proyectos, y salas</h1>
        <button onClick={irProyectos}>Gestionar Proyectos</button> {/* Botón para ir al panel */}
        <button onClick={irSalas}>Gestionar Salas</button> {/* Botón para ir al panel */}

        {/* <button onClick={handleGoToPanel}>Gestionar Salas</button> */}
        </div>
    );
};

export default Paneles;