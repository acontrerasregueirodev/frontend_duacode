import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Salas.css";
const Salas = () => {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rooms = [
    {
      id: 1,
      name: "Sala de Reuniones A",
      capacity: 10,
      availability: "Libre",
      status: "Disponible",
    },
    {
      id: 2,
      name: "Sala de Conferencias",
      capacity: 25,
      availability: "Ocupada",
      status: "No Disponible",
    },
    {
      id: 3,
      name: "Sala de Proyectos",
      capacity: 15,
      availability: "Libre",
      status: "Disponible",
    },
  ];

  // useEffect(() => {
  //   const fetchSalas = async () => {
  //     try {
  //       const response = await axios.get('');
  //       setSalas(response.data);
  //     } catch (error) {
  //       setError('Error al obtener las salas');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchSalas();
  // }, []);
  // if (loading) return <p>Cargando salas...</p>;
  // if (error) return <p>{error}</p>;

  return (
    <section className="room-section">
      <h2 className="room-section-title">Salas y Disponibilidad</h2>
      <div className="room-cards">
        {rooms.map((room) => (
          <div className="room-card" key={room.id}>
            <h3 className="room-name">{room.name}</h3>
            <p className="room-info">
              <strong>Aforo:</strong> {room.capacity}
            </p>
            <p className="room-info">
              <strong>Disponibilidad:</strong> {room.availability}
            </p>
            <p className="room-info">
              <strong>Estado:</strong> {room.status}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Salas;
