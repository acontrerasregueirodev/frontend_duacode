import React from 'react';
import PerfilUsuario from './PerfilUsuario';
import Preferencias from './PreferenciasUsuario';
import '../../styles/configuracion.css'; 

const Configuracion = () => {
  return (
    <div className="configuracion-container">
      <h1>Configuración</h1>
      <div className="configuracion-grid">
        <PerfilUsuario />
        <Preferencias />
      </div>
    </div>
  );
};

export default Configuracion;
