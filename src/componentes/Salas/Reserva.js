import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/Salas/ListaReservas.css";

const Reserva = () => {
  const { salaId } = useParams();
  const [reservas, setReservas] = useState([]);
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [empleadosAsistentes, setEmpleadosAsistentes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [reservaParaEditar, setReservaParaEditar] = useState(null);

  const getCSRFToken = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="));
    return cookie ? cookie.split("=")[1] : null;
  };

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const csrfToken = getCSRFToken();
        const reservasResponse = await axios.get(
          `https://belami.pythonanywhere.com/api/sedes/reservas/`,
          {
            withCredentials: true,
            headers: { "X-CSRFToken": csrfToken },
          }
        );
        setReservas(reservasResponse.data);

        const empleadosResponse = await axios.get(
          `https://belami.pythonanywhere.com/api/empleados/`,
          {
            withCredentials: true,
            headers: { "X-CSRFToken": csrfToken },
          }
        );
        setEmpleados(empleadosResponse.data);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchDatos();
  }, []);

  const handleReserva = async (e) => {
    e.preventDefault();
    const nuevaReserva = {
      sala: salaId,
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      empleados_asistentes: empleadosAsistentes,
    };
    try {
      const csrfToken = getCSRFToken();
      const response = await axios.post(
        `https://belami.pythonanywhere.com/api/sedes/reservas/`,
        nuevaReserva,
        {
          withCredentials: true,
          headers: { "X-CSRFToken": csrfToken },
        }
      );
      alert("Reserva creada exitosamente!");
      setReservas([...reservas, response.data]);
      setFecha("");
      setHoraInicio("");
      setHoraFin("");
      setEmpleadosAsistentes([]);
    } catch (error) {
      console.error("Error al realizar la reserva:", error.response.data);
      alert("Error al realizar la reserva");
    }
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    const reservaActualizada = {
      sala: salaId,
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      empleados_asistentes: empleadosAsistentes,
    };
    try {
      const csrfToken = getCSRFToken();
      const response = await axios.put(
        `https://belami.pythonanywhere.com/api/sedes/reservas/${reservaParaEditar.id}/`,
        reservaActualizada,
        {
          withCredentials: true,
          headers: { "X-CSRFToken": csrfToken },
        }
      );
      alert("Reserva editada exitosamente!");
      setReservas(
        reservas.map((reserva) =>
          reserva.id === reservaParaEditar.id ? response.data : reserva
        )
      );
      setModoEdicion(false);
      setReservaParaEditar(null);
      setFecha("");
      setHoraInicio("");
      setHoraFin("");
      setEmpleadosAsistentes([]);
    } catch (error) {
      console.error("Error al editar la reserva:", error.response.data);
      alert("Error al editar la reserva");
    }
  };

  const handleEliminar = async (id) => {
    try {
      const csrfToken = getCSRFToken();
      await axios.delete(`https://belami.pythonanywhere.com/api/sedes/reservas/${id}/`, {
        withCredentials: true,
        headers: { "X-CSRFToken": csrfToken },
      });
      setReservas(reservas.filter((reserva) => reserva.id !== id));
      alert("Reserva eliminada exitosamente!");
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      alert("Error al eliminar la reserva");
    }
  };

  const handleEditar = (reserva) => {
    setReservaParaEditar(reserva);
    setFecha(reserva.fecha);
    setHoraInicio(reserva.hora_inicio);
    setHoraFin(reserva.hora_fin);
    setEmpleadosAsistentes(reserva.empleados_asistentes);
    setModoEdicion(true);
  };

  if (loading) return <p className="loading-message">Cargando reservas...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="reserva-container">
      <div className="titulo-principal">
        {modoEdicion ? "Editar Reserva" : "Reservar Sala"}
      </div>
      <form
        onSubmit={modoEdicion ? handleGuardarEdicion : handleReserva}
        className="formulario-reserva"
      >
        <label>
          Fecha:
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </label>
        <label>
          Hora de Inicio:
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
          />
        </label>
        <label>
          Hora de Fin:
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
          />
        </label>
        <label>
          Empleados Asistentes:
          <select
            multiple
            value={empleadosAsistentes}
            onChange={(e) =>
              setEmpleadosAsistentes(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {empleados.map((empleado) => (
              <option key={empleado.id} value={empleado.id}>
                {empleado.nombre} {empleado.apellido_1}
              </option>
            ))}
          </select>
        </label>
        <div className="botones-formulario">
          <button type="submit" className="boton-submit">
            {modoEdicion ? "Guardar Cambios" : "Reservar"}
          </button>
          {modoEdicion && (
            <button
              type="button"
              className="boton-cancelar"
              onClick={() => setModoEdicion(false)}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      <div className="titulo-secundario">Reservas existentes</div>
      <ul className="lista-reservas">
        {reservas.map((reserva) => (
          <li key={reserva.id} className="item-reserva">
            <strong>{reserva.fecha}</strong> {reserva.hora_inicio} -{" "}
            {reserva.hora_fin}
            <div className="acciones-reserva">
              <button
                onClick={() => handleEditar(reserva)}
                className="boton-editar"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminar(reserva.id)}
                className="boton-eliminar"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reserva;
