import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Principal.css";

function Principal() {
  const [empleadoDetail, setEmpleadoDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    const fetchEmpleadoDetail = async () => {
      try {
        const id = 2;
        const response = await axios.get(`https://belami.pythonanywhere.com/api/empleados/${id}`);
        setEmpleadoDetail(response.data);
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleadoDetail();
  }, []);

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
    <div className="main">
      <div className="header">
        <h1>duacode<span>.</span></h1>
        <div className="icons">
          <span className="icon-bell">🔔</span>
          <span className="icon-login">→</span>
        </div>
      </div>

      <div className="content">
        <h2>Bienvenido {empleadoDetail?.nombre}</h2>
        <div className="user-icon">
          <img
            src={empleadoDetail?.foto || "ruta/a/imagen-predeterminada.jpg"}
            alt={`${empleadoDetail?.nombre} ${empleadoDetail?.apellido_1}`}
            onError={(e) => (e.target.src = "ruta/a/imagen-predeterminada.jpg")}
          />
        </div>
        <p>{roleName || "Sin rol asignado"}</p>
      </div>
    </div>
  );
}

export default Principal;
