import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/inicio.css';
import IconoLogin from '../assets/login.svg'; 

const Header = ({ menuOpen, setMenuOpen }) => {
  const navigate = useNavigate(); 

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
    </header>
  );
};

export default Header;
