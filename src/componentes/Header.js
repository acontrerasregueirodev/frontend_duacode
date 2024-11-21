import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir
import '../styles/inicio.css';

const Header = ({ menuOpen, setMenuOpen, searchVisible, setSearchVisible, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate(); // Hook para navegación

  return (
    <header className={`header ${menuOpen ? "menu-open" : ""}`}>
      <div
        className={`menu-button ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
        <span />
      </div>
      <div className="logo">
        <h1 className="brand-title">
          duacode<span className="highlight">.</span>
        </h1>
      </div>
      <div className="header-buttons">
        <button className="login-button" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;
