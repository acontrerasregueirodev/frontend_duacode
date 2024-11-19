// Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
const Navigation = () => {
  return (
    <div>
      <Link to="/test/empleados" className="nav-button">
        Empleados
      </Link><br/>
      <Link to="/test/proyectos" className="nav-button">
        Proyectos
      </Link><br/>
      <Link to="/test/sedes" className="nav-button">
        Sedes
      </Link><br/>
      <Link to="/test/salas" className="nav-button">
        Salas
      </Link>
      
    </div>
    
  );
};

export default Navigation;




