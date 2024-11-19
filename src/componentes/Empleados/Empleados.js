import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header from "../Header";
import EmployeeGrid from "./EmployeeGrid";
import LoadMoreButton from "../LoadMoreButton";
import Spinner from "../Spinner";
import VirtualKeyboard from "../VirtualKeyboard"; // Importa el teclado virtual
import "../../styles/empleados/empleados.css";

const Empleados = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(false); // Estado para mostrar/ocultar el teclado
  const employeesPerPage = 10;

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("https://belami.pythonanywhere.com/api/empleados/", {
        params: { page, limit: employeesPerPage },
      });
      if (data.length > 0) {
        setEmployees((prev) => [
          ...prev,
          ...data.filter((e) => !prev.some((emp) => emp.id === e.id)),
        ]);
        if (data.length < employeesPerPage) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error buscando empleado:", error);
      alert("Error al buscar al usuario. Inténtelo más tarde.");
      setHasMore(false);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const loadMore = () => !loading && hasMore && setPage((prev) => prev + 1);

  const filteredEmployees = employees.filter(({ nombre, apellido_1 }) =>
    `${nombre} ${apellido_1}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchClick = () => {
    if (window.confirm("¿Quieres abrir el teclado en pantalla?")) {
      setShowKeyboard(true); // Si el usuario confirma, muestra el teclado
    }
  };

  const handleKeyPress = (key) => {
    if (key === "Backspace") {
      setSearchTerm(searchTerm.slice(0, -1));
    } else if (key === "Space") {
      setSearchTerm(searchTerm + " ");
    } else {
      setSearchTerm(searchTerm + key);
    }
  };

  const closeKeyboard = () => {
    setShowKeyboard(false);
  };

  return (
    <div className={`empleados-page ${menuOpen ? "menu-active" : ""}`}>
      <Header
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        searchVisible={searchVisible}
        setSearchVisible={setSearchVisible}
      />
      <main className="employees-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={handleSearchClick} // Muestra el teclado al hacer clic
          />
        </div>

        {filteredEmployees.length === 0 ? (
          <p>Empleado no encontrado.</p>
        ) : (
          <EmployeeGrid
            empleados={filteredEmployees.slice(0, page * employeesPerPage)}
          />
        )}

        {hasMore && !loading && (
          <LoadMoreButton cargarMas={loadMore} />
        )}

        {loading && <Spinner />}

        {/* Renderiza el teclado virtual si `showKeyboard` es verdadero */}
        {showKeyboard && <VirtualKeyboard onKeyPress={handleKeyPress} onClose={closeKeyboard} />}
      </main>
    </div>
  );
};

export default Empleados;
