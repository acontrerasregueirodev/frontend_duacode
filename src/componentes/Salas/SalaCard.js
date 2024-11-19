import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SalaCard = ({ sala }) => {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/sedes/sedes/");
        setSedes(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error al cargar las sedes");
        setLoading(false);
      }
    };

    fetchSedes();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const sede = sedes.find(sede => sede.id === sala.sede);

  return (
    <div className="sala-card">
      <h2>{sala.nombre}</h2>
      <img src={sala.imagen_url} width={"120px"} height={"100px"} alt="Sala" />
      <p>
        <strong>Capacidad:</strong> {sala.capacidad} personas
      </p>
      <p>
        <strong>Sede:</strong> {sede ? sede.nombre : "Sede no encontrada"}
      </p>
      <p>
        <strong>Dirección:</strong> {sede ? sede.direccion : "Sede no encontrada"}
      </p>
      <Link to={`/reserva/${sala.id}`} className="reservar-btn">
        Reservar
      </Link>
    </div>
  );
};

export default SalaCard;
