import React from 'react';
import '../styles/inicio.css';

const Header = ({ menuOpen, setMenuOpen, searchVisible, setSearchVisible, searchTerm, setSearchTerm }) => {
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
