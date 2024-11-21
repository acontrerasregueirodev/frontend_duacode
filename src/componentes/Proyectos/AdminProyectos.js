import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/proyectos/AdminProyectos.css";

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalNuevoProyectoVisible, setModalNuevoProyectoVisible] =
    useState(false);
  const [proyectoEditado, setProyectoEditado] = useState(null);
  const [nuevoProyecto, setNuevoProyecto] = useState({
    nombre: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    empleados: [],
  });

  const obtenerProyectos = async () => {
    try {
      const response = await axios.get("https://belami.pythonanywhere.com/api/proyectos/", {
        withCredentials: true,
      });
      setProyectos(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los proyectos:", error);
      setLoading(false);
    }
  };

  const obtenerEmpleados = async () => {
    try {
      const response = await axios.get("https://belami.pythonanywhere.com/api/empleados/", {
        withCredentials: true,
      });
      setEmpleados(response.data);
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
    }
  };

  const eliminarProyecto = async (id) => {
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];
      await axios.delete(`https://belami.pythonanywhere.com/api/proyectos/${id}/`, {
        withCredentials: true,
        headers: { "X-CSRFToken": csrfToken },
      });
      setProyectos(proyectos.filter((proyecto) => proyecto.id !== id));
      alert("Proyecto eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
      alert("No se pudo eliminar el proyecto");
    }
  };

  const editarProyecto = (proyecto) => {
    setProyectoEditado(proyecto);
    setModalVisible(true);
  };

  const guardarEdicion = async () => {
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];
      await axios.put(
        `https://belami.pythonanywhere.com/api/proyectos/${proyectoEditado.id}/`,
        proyectoEditado,
        {
          withCredentials: true,
          headers: { "X-CSRFToken": csrfToken },
        }
      );

      setProyectos(
        proyectos.map((p) =>
          p.id === proyectoEditado.id ? proyectoEditado : p
        )
      );
      setModalVisible(false);
      alert("Proyecto editado exitosamente");
    } catch (error) {
      console.error("Error al editar el proyecto:", error);
      alert("No se pudo editar el proyecto");
    }
  };

  const handleNuevoProyectoChange = (e) => {
    const { name, value } = e.target;
    setNuevoProyecto({ ...nuevoProyecto, [name]: value });
  };

  const guardarNuevoProyecto = async () => {
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];
      await axios.post("https://belami.pythonanywhere.com/api/proyectos/", nuevoProyecto, {
        withCredentials: true,
        headers: { "X-CSRFToken": csrfToken },
      });
      obtenerProyectos();
      setModalNuevoProyectoVisible(false);
      alert("Nuevo proyecto creado exitosamente");
    } catch (error) {
      console.error("Error al crear el proyecto:", error);
      alert("No se pudo crear el proyecto");
    }
  };

  const handleEmpleadoChange = (e, empleadoId) => {
    const { checked } = e.target;
    if (checked) {
      setNuevoProyecto((prev) => ({
        ...prev,
        empleados: [...prev.empleados, empleadoId],
      }));
    } else {
      setNuevoProyecto((prev) => ({
        ...prev,
        empleados: prev.empleados.filter((id) => id !== empleadoId),
      }));
    }
  };

  useEffect(() => {
    obtenerProyectos();
    obtenerEmpleados();
  }, []);

  if (loading) return <p>Cargando proyectos...</p>;

  return (
    <div className="proyectos-container">
      <h2 className="proyectos-header">Lista de Proyectos</h2>
      {proyectos.length === 0 ? (
        <p>No hay proyectos disponibles.</p>
      ) : (
        <ul className="proyectos-list">
          {proyectos.map((proyecto) => (
            <li key={proyecto.id} className="proyecto-item">
              <strong>{proyecto.nombre}</strong>
              <p>{proyecto.descripcion}</p>
              <p>
                <b>Fecha de inicio:</b>{" "}
                {new Date(proyecto.fecha_inicio).toLocaleDateString()}
              </p>
              <p>
                <b>Fecha de fin:</b>
                {proyecto.fecha_fin
                  ? new Date(proyecto.fecha_fin).toLocaleDateString()
                  : "En progreso"}
              </p>
              <div className="empleados-gallery">
                {proyecto.empleados.map((empleado) => (
                  <div key={empleado.id} className="empleado-item">
                    <p>
                      {empleado.nombre} {empleado.apellido_1}
                    </p>
                    {empleado.foto && (
                      <img
                        src={empleado.foto}
                        alt={`${empleado.nombre} ${empleado.apellido_1}`}
                        className="empleado-foto"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="buttons-container">
                <button
                  className="editar-proyecto-btn"
                  onClick={() => editarProyecto(proyecto)}
                >
                  Editar
                </button>
                <button
                  className="eliminar-proyecto-btn"
                  onClick={() => eliminarProyecto(proyecto.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {(modalVisible || modalNuevoProyectoVisible) && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              {modalNuevoProyectoVisible
                ? "Crear Nuevo Proyecto"
                : "Editar Proyecto"}
            </h3>
            <label>
              Nombre del Proyecto:
              <input
                type="text"
                name="nombre"
                value={
                  modalNuevoProyectoVisible
                    ? nuevoProyecto.nombre
                    : proyectoEditado?.nombre
                }
                onChange={
                  modalNuevoProyectoVisible
                    ? handleNuevoProyectoChange
                    : (e) => handleNuevoProyectoChange(e)
                }
              />
            </label>
            <label>
              Descripción:
              <textarea
                name="descripcion"
                value={
                  modalNuevoProyectoVisible
                    ? nuevoProyecto.descripcion
                    : proyectoEditado?.descripcion
                }
                onChange={
                  modalNuevoProyectoVisible
                    ? handleNuevoProyectoChange
                    : (e) => handleNuevoProyectoChange(e)
                }
              />
            </label>
            <label>
              Fecha de inicio:
              <input
                type="date"
                name="fecha_inicio"
                value={
                  modalNuevoProyectoVisible
                    ? nuevoProyecto.fecha_inicio
                    : proyectoEditado?.fecha_inicio
                }
                onChange={
                  modalNuevoProyectoVisible
                    ? handleNuevoProyectoChange
                    : (e) => handleNuevoProyectoChange(e)
                }
              />
            </label>
            <label>
              Fecha de fin:
              <input
                type="date"
                name="fecha_fin"
                value={
                  modalNuevoProyectoVisible
                    ? nuevoProyecto.fecha_fin
                    : proyectoEditado?.fecha_fin || ""
                }
                onChange={
                  modalNuevoProyectoVisible
                    ? handleNuevoProyectoChange
                    : (e) => handleNuevoProyectoChange(e)
                }
              />
            </label>

            <div className="empleados-no-asignados">
              <h4>Empleados</h4>
              {empleados.map((empleado) => (
                <div key={empleado.id}>
                  <input
                    type="checkbox"
                    id={`empleado-${empleado.id}`}
                    checked={
                      modalNuevoProyectoVisible
                        ? nuevoProyecto.empleados.includes(empleado.id)
                        : proyectoEditado?.empleados.some(
                            (emp) => emp.id === empleado.id
                          )
                    }
                    onChange={(e) => handleEmpleadoChange(e, empleado.id)}
                  />
                  <label htmlFor={`empleado-${empleado.id}`}>
                    {empleado.nombre} {empleado.apellido_1}
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={
                modalNuevoProyectoVisible
                  ? guardarNuevoProyecto
                  : guardarEdicion
              }
            >
              {modalNuevoProyectoVisible ? "Crear Proyecto" : "Guardar Cambios"}
            </button>
            <button
              onClick={() => {
                setModalNuevoProyectoVisible(false);
                setModalVisible(false);
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <button
        className="agregar-proyecto-btn"
        onClick={() => setModalNuevoProyectoVisible(true)}
      >
        Agregar Proyecto
      </button>
    </div>
  );
};

export default Proyectos;
