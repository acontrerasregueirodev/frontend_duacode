import React, { useState, useEffect } from "react";
import "../../styles/empleados/AdminEmpleados.css";

const getCsrfToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    .split("=")[1];
};

const PanelEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [roles, setRoles] = useState([]); // New state for roles
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    id: null,
    nombre: "",
    apellido_1: "",
    apellido_2: "",
    email: "",
    telefono: "",
    fecha_contratacion: "",
    cumpleaños: "",
    is_on_leave: false,
    rol: { id: "", nombre: "" },
    sede: "",
    foto: null,
  });

  const [error, setError] = useState(null);
  const API_URL = "https://belami.pythonanywhere.com/api/empleados/";
  const ROLES_URL = "https://belami.pythonanywhere.com/api/roles/"; // URL for roles API

  const leerEmpleados = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al cargar datos");
      const data = await response.json();
      setEmpleados(data);
    } catch (err) {
      setError(err);
    }
  };

  // Fetch roles from the API
  const leerRoles = async () => {
    try {
      const response = await fetch(ROLES_URL);
      if (!response.ok) throw new Error("Error al cargar roles");
      const data = await response.json();
      setRoles(data); // Set the roles state
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    leerEmpleados();
    leerRoles(); // Fetch roles when the component mounts
  }, []);

  const eliminarEmpleado = async (empleadoId) => {
    try {
      const response = await fetch(`${API_URL}${empleadoId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al eliminar empleado");
      await leerEmpleados();
      alert("Empleado eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      alert("No se pudo eliminar el empleado.");
    }
  };

  const agregarEmpleado = async () => {
    const empleadoData = new FormData();
    Object.keys(nuevoEmpleado).forEach((key) => {
      empleadoData.append(key, nuevoEmpleado[key]);
    });
    if (nuevoEmpleado.foto) {
      empleadoData.append("foto", nuevoEmpleado.foto);
    }

    try {
      const response = nuevoEmpleado.id
        ? await fetch(`${API_URL}${nuevoEmpleado.id}/`, {
            method: "PUT",
            headers: { "X-CSRFToken": getCsrfToken() },
            credentials: "include",
            body: empleadoData,
          })
        : await fetch(API_URL, {
            method: "POST",
            headers: { "X-CSRFToken": getCsrfToken() },
            credentials: "include",
            body: empleadoData,
          });
      if (!response.ok) throw new Error("Error al guardar empleado");
      await leerEmpleados();
      setNuevoEmpleado({
        id: null,
        nombre: "",
        apellido_1: "",
        apellido_2: "",
        email: "",
        telefono: "",
        fecha_contratacion: "",
        cumpleaños: "",
        is_on_leave: false,
        rol: { id: "", nombre: "" },
        sede: "",
        foto: null,
      });
      alert(
        nuevoEmpleado.id
          ? "Empleado actualizado con éxito"
          : "Empleado agregado con éxito"
      );
    } catch (error) {
      console.error("Error al agregar/actualizar empleado:", error);
      alert(
        "No se pudo agregar/actualizar el empleado. Por favor, verifica los datos."
      );
    }
  };

  const manejarInputs = (key, value) => {
    setNuevoEmpleado((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const editarEmpleado = (empleado) => {
    setNuevoEmpleado({
      id: empleado.id,
      nombre: empleado.nombre,
      apellido_1: empleado.apellido_1,
      apellido_2: empleado.apellido_2,
      email: empleado.email,
      telefono: empleado.telefono,
      fecha_contratacion: empleado.fecha_contratacion,
      cumpleaños: empleado.cumpleaños,
      is_on_leave: empleado.is_on_leave,
      rol: empleado.rol,
      sede: empleado.sede,
      foto: null, 
    });
  };

  return (
    <div>
      <h2>Administración de Empleados</h2>
      <div className="section full">
        <div className="nuevo-empleado">
          <h3>
            {nuevoEmpleado.id ? "Editar Empleado" : "Agregar Nuevo Empleado"}
          </h3>
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoEmpleado.nombre}
            onChange={(e) => manejarInputs("nombre", e.target.value)}
          />
          <input
            type="text"
            placeholder="Apellido 1"
            value={nuevoEmpleado.apellido_1}
            onChange={(e) => manejarInputs("apellido_1", e.target.value)}
          />
          <input
            type="text"
            placeholder="Apellido 2"
            value={nuevoEmpleado.apellido_2}
            onChange={(e) => manejarInputs("apellido_2", e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={nuevoEmpleado.email}
            onChange={(e) => manejarInputs("email", e.target.value)}
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={nuevoEmpleado.telefono}
            onChange={(e) => manejarInputs("telefono", e.target.value)}
          />
          <input
            type="date"
            placeholder="Fecha Contratación"
            value={nuevoEmpleado.fecha_contratacion}
            onChange={(e) =>
              manejarInputs("fecha_contratacion", e.target.value)
            }
          />
          <input
            type="date"
            placeholder="Cumpleaños"
            value={nuevoEmpleado.cumpleaños}
            onChange={(e) => manejarInputs("cumpleaños", e.target.value)}
          />
          <select
            value={String(nuevoEmpleado.rol.id) || ""}
            onChange={(e) => manejarInputs("rol", e.target.value)}
          >
            <option value="">Selecciona un rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Sede"
            value={nuevoEmpleado.sede}
            onChange={(e) => manejarInputs("sede", e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => manejarInputs("foto", e.target.files[0])}
          />
          <button onClick={agregarEmpleado}>
            {nuevoEmpleado.id ? "Actualizar Empleado" : "Agregar Empleado"}
          </button>
        </div>

        <div className="lista-empleados">
          <h3>Empleados Actuales</h3>
          <ul>
            {empleados.map((empleado) => (
              <li key={empleado.id}>
                <img
                  src={empleado.foto}
                  alt={`${empleado.nombre} ${empleado.apellido_1}`}
                />
                <span>
                  {empleado.nombre} {empleado.apellido_1} {empleado.apellido_2}
                </span>
                <div className="botones">
                  <button
                    className="editar"
                    onClick={() => editarEmpleado(empleado)}
                  >
                    Editar
                  </button>
                  <button onClick={() => eliminarEmpleado(empleado.id)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PanelEmpleados;
