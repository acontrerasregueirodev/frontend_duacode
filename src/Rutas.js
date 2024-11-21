// src/Rutas.js
import React from 'react';
import { Route } from 'react-router-dom';
import Bienvenida from './componentes/Bienvenida';
import Principal from './componentes/Principal';
import EmpleadoManager from './componentes/Empleados/EmpleadoManager';
import Empleados from './componentes/Empleados/Empleados';
import DetalleEmpleados from './componentes/Empleados/DetalleEmpleados';
import Proyectos from './componentes/Proyectos/Proyectos';
import DetalleProyectos from './componentes/Proyectos/DetalleProyectos';
import Organigrama from './componentes/Organigrama/Organigrama';
import Protocolo from './componentes/Protocolos/Protocolos';
import Multisede from './componentes/Multisede';
import Configuracion from './componentes/Configuracion/Configuracion';
import Sedes from './componentes/Sedes/Sedes';
import Mapa from './componentes/Mapa';
import Salas from './componentes/Salas/Salas';
import Reserva from './componentes/Salas/Reserva';
// IMPORTS PARA VISTA KIOSKO TEST ADRIAN
import KioskoDuacode from './componentes/Kiosko/KioskoDuacode'; // Si aún lo necesitas
import AdminEmpleados from './componentes/Empleados/AdminEmpleados';
import AdminProyectos from './componentes/Proyectos/AdminProyectos';
import AdminSalas from './componentes/Salas/AdminSalas';
import PanelEmpleados from './componentes/Kiosko/PanelEmpleados';
import PanelProyectos from './componentes/Kiosko/PanelProyectos/PanelProyectos';
import PanelSalas from './componentes/Kiosko/PanelSalas/PanelSalas'
import Login from './componentes/Login';



const Rutas = () => {
  return (
    <>
      <Route path="/" element={<Bienvenida />} />
      <Route path="/inicio" element={<Principal />} />
      <Route path="/Empleados/empleados" element={<EmpleadoManager />} />
      <Route path="/detalleEmpleado" element={<Empleados />} />
      <Route path="/Proyectos/proyectos" element={<Proyectos />} />
      <Route path="/proyectos/:id" element={<DetalleProyectos />} />
      <Route path="/organigrama" element={<Organigrama />} />
      <Route path="/Protocolos/protocolos" element={<Protocolo />} />
      <Route path="/multisede" element={<Multisede />} />
      <Route path="/configuracion" element={<Configuracion />} />
      <Route path="/empleados/:id" element={<DetalleEmpleados />} />
      <Route path="/sedes" element={<Sedes />} />
      <Route path="/salas/:sedeId" element={<Salas />} />
      <Route path="/mapa" element={<Mapa />} />
      <Route path="/reserva/:salaId" element={<Reserva />} />
      {/* Rutas para la vista Test  Kiosko  Adrian */}
          <Route path="/test/empleados" element={<PanelEmpleados />} />
          <Route path="/test/proyectos" element={<PanelProyectos />} />
          <Route path="/test/sedes" element={<h2>Lista de Sedes</h2>} />
          <Route path="/test/salas" element={<PanelSalas />} />
      {/* Muestra KioskoDuacode en la ruta principal */}
          <Route path="/test" element={<KioskoDuacode />} /> 

          {/* Agrega más rutas aquí según sea necesario */}
          <Route path="/admin/empleados" element={<AdminEmpleados />} />
          <Route path="/admin/proyectos" element={<AdminProyectos />} />
          <Route path="/admin/salas" element={<AdminSalas />} />

      <Route path="/login" element={<Login />} /> {/* Nueva ruta para Login */}
    </>
  );
}

export default Rutas;
