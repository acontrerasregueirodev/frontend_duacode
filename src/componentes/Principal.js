// Principal.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import "../styles/Principal.css";

function Principal() {
  const [empleadoDetail, setEmpleadoDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error al leer el usuario de localStorage:", err);
    }
  }, []);

  useEffect(() => {
    const fetchEmpleadoDetail = async () => {
      if (!user) return;

      try {
        const id = user.id || 2; // Valor predeterminado
        const response = await axios.get(`https://belami.pythonanywhere.com/api/empleados/${id}`);
        setEmpleadoDetail(response.data);
      } catch (err) {
        console.error("Error al obtener los detalles del empleado:", err);
        setError(`Error al cargar datos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleadoDetail();
  }, [user]);

  useEffect(() => {
    const fetchRoleName = async () => {
      if (!empleadoDetail?.rol) return;

      try {
        const response = await axios.get("https://belami.pythonanywhere.com/api/roles/");
        const roles = response.data;
        const role = roles.find((role) => role.id === empleadoDetail.rol);

        setRoleName(role ? role.nombre : "Rol no encontrado");
      } catch (error) {
        console.error("Error al obtener los roles:", error);
        setRoleName("Error al cargar rol");
      }
    };

    fetchRoleName();
  }, [empleadoDetail]);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header />
      <div className="content">
        <h2>Bienvenido {user?.nombre || "Usuario"}</h2>
        <div className="user-icon">
          <img
            src={empleadoDetail?.foto || "foto del empleado"}
            alt={`${empleadoDetail?.nombre || "Nombre"} ${empleadoDetail?.apellido_1 || "Apellido"}`}
            onError={(e) => (e.target.src = "ruta/a/imagen-predeterminada.jpg")}
          />
        </div>
        <p>{roleName || "Sin rol asignado"}</p>
      </div>
    </div>
  );
}

export default Principal;
