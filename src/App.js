import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Organigrama from "./pages/Organigrama/Organigrama"
import Proyectos from "./pages/Proyectos/Proyectos";
import TestCalendario from "./pages/TestCalendario/TestCalendario"
import Salas from "./pages/Salas/Salas";
import OrganigramaMateo from './pages/Organigrama/OrganigramaMateo';

// App component
const App = () => {
  const location = useLocation(); 

  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/organigrama" element={<Organigrama />} />
          <Route path="/testcalendario" element={<TestCalendario />} />
          <Route path="/login" element={<Login />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/salas" element={<Salas/>}/>
          <Route path="/organigramaMateo" element={<OrganigramaMateo />} />
        </Routes>
      </main>
      {/* Renderiza el Footer solo si no estás en la página de login */}
      {location.pathname !== "/login" && <Footer />}
    </div>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;