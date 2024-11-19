import React, { useEffect, useState } from "react";
import axios from "axios";

const DetalleEmplCarta = ({ empleadoDetail }) => {
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    const fetchRoleName = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/roles/");
        const roles = response.data;

        const role = roles.find((role) => role.id === empleadoDetail.rol);
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
  }, [empleadoDetail.rol]);

  return (
    <div className="detalle-empleado-card">
      <img
        src={empleadoDetail.foto}
        alt={`${empleadoDetail.nombre} ${empleadoDetail.apellido_1}`}
        className="empleado-imagen"
      />
      <h2>
        {empleadoDetail.nombre} {empleadoDetail.apellido_1}{" "}
        {empleadoDetail.apellido_2}
      </h2>
      <p>
        <strong>Email:</strong> {empleadoDetail.email}
      </p>
      <p>
        <strong>Teléfono:</strong> {empleadoDetail.telefono}
      </p>
      <p>
        <strong>Puesto:</strong> {roleName}
      </p>
      <p>
        <strong>Fecha de Contratación:</strong>{" "}
        {empleadoDetail.fecha_contratacion}
      </p>
      <p>
        <strong>Cumpleaños:</strong> {empleadoDetail.cumpleaños}
      </p>
      <p>
        <strong>Estado:</strong>{" "}
        {empleadoDetail.is_on_leave ? "Está de baja" : "No está de baja"}
      </p>
    </div>
  );
};

export default DetalleEmplCarta;
