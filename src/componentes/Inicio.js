import React, { useState } from 'react';
import { Link, Routes } from 'react-router-dom'; // Importa `Routes` de `react-router-dom`
import { useTranslation } from 'react-i18next';
import Rutas from '../Rutas.js'; // Importa las rutas desde el archivo independiente

function Inicio() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container">
      {/* Código del menú lateral */}
      <div className={`menu-button ${isSidebarOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h1 className="brand-title">
            Panel UX<span className="highlight">.</span>
          </h1>
        </div>

        <ul>
          <li><Link to="/inicio" onClick={toggleMenu}>{t('inicio')}</Link></li>
          <li><Link to="/detalleEmpleado" onClick={toggleMenu}>{t('empleados')}</Link></li>
          <li><Link to="/sedes" onClick={toggleMenu}>{t('salas')}</Link></li>
          <li><Link to="/Proyectos/proyectos" onClick={toggleMenu}>{t('proyectos')}</Link></li>
          <li><Link to="/organigrama" onClick={toggleMenu}>{t('organigrama')}</Link></li>
          <li><Link to="/Protocolos/protocolos" onClick={toggleMenu}>{t('protocolos')}</Link></li>
          <li><Link to="/configuracion" onClick={toggleMenu}>{t('configuracion')}</Link></li>
        </ul>

        {/* duacode en la parte inferior del sidebar */}
        <div className="sidebar-footer">
          <h1 className="brand-title">
            duacode<span className="highlight">.</span>
          </h1>
          <img src="/images/file.png" alt="UX Logo" className="ux-logo" />
        </div>
      </div>

      {/*link a login */}
      <div className={`main ${isSidebarOpen ? 'active' : ''}`}>
        <header className={`header ${isSidebarOpen ? 'active' : ''}`}>
          <h1 className="brand-title">
            <Link to="/login" className="header-link">
              duacode<span className="highlight">.</span>
            </Link>
          </h1>
        </header>

        {/* Routing */}
        <div className="content">
          <Routes>{Rutas()}</Routes> {/* Renderiza las rutas aquí */}
        </div>
      </div>
    </div>
  );
}

export default Inicio;
