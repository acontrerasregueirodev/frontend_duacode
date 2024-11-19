import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Función para obtener el token CSRF
const obtenerCsrfToken = () => {
  const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  const csrfToken = csrfCookie ? csrfCookie.split('=')[1] : null;
  console.log("Token CSRF obtenido en obtenerCsrfToken:", csrfToken);
  return csrfToken;
};

const EditarPerfil = ({ id, onSave, onCancel }) => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  console.log("Estado de error actualizado:", error);
}, [error]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/empleados/${id}/`, {
          headers: {
            'X-CSRFToken': obtenerCsrfToken(),
          },
          withCredentials: true,
        });
        setEmployeeData(response.data);
        setError(null); // Limpia errores al cargar datos exitosamente
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.detail || 'Error al obtener los datos del empleado');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpia el estado de error antes de intentar guardar
    setError(null);

    const updatedEmployeeData = {
      nombre: employeeData.nombre,
      apellido_1: employeeData.apellido_1,
      apellido_2: employeeData.apellido_2,
      email: employeeData.email,
      telefono: employeeData.telefono,
    };

    try {
      const response = await axios.put(`http://localhost:8000/api/empleados/${id}/`, updatedEmployeeData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': obtenerCsrfToken(),
        },
        withCredentials: true,
      });

      console.log('Datos guardados exitosamente:', response.data);
      setError(null); // Limpia cualquier mensaje de error tras un éxito
      onSave(response.data); // Notifica al componente padre
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al actualizar los datos del empleado');
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Editar Perfil</h1>
      {/* Muestra el error solo si existe */}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={employeeData?.nombre || ''}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Apellido 1:
            <input
              type="text"
              name="apellido_1"
              value={employeeData?.apellido_1 || ''}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Apellido 2:
            <input
              type="text"
              name="apellido_2"
              value={employeeData?.apellido_2 || ''}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={employeeData?.email || ''}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Teléfono:
            <input
              type="tel"
              name="telefono"
              value={employeeData?.telefono || ''}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit">Guardar Cambios</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </form>
    </div>
  );
};

export default EditarPerfil;
