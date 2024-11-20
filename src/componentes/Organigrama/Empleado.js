import React, { useEffect, useState } from "react";
import axios from "axios";

const Empleado = ({ empleado }) => {
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    const fetchRoleName = async () => {
      try {
        const response = await axios.get("https://belami.pythonanywhere.com/api/roles/");
        const roles = response.data;

        const role = roles.find((role) => role.id === empleado.rol);
        if (role) {
          setRoleName(role.nombre);
        } else {
          setRoleName("Rol no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener los roles:", error);
        setRoleName("Error al cargar rol");
      }
    };

    fetchRoleName();
  }, [empleado.rol]);

  return (
    <div className="empleado-card">
      <img src={empleado.foto} alt={empleado.nombre} className="empleado-foto" />
      <h3>{empleado.nombre}</h3>
      <p>
        <strong>Puesto:</strong> {roleName}
      </p>
      <p>
        <strong>Email:</strong> {empleado.email}
      </p>
    </div>
  );
};

export default Empleado;