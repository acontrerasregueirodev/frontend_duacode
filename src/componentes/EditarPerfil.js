import React, { useState, useEffect } from 'react';

const EditarPerfil = ({ id, onSave, onCancel }) => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(`https://belami.pythonanywhere.com/api/empleados/${id}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error: ${errorData.detail || response.statusText}`);
        }
        const data = await response.json();
        setEmployeeData(data);
      } catch (err) {
        setError(err.message);
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

    // Solo se envían los campos requeridos
    const updatedEmployeeData = {
      nombre: employeeData.nombre,
      apellido_1: employeeData.apellido_1,
      apellido_2: employeeData.apellido_2,
      email: employeeData.email,
      telefono: employeeData.telefono
    };

    try {
      const response = await fetch(`https://belami.pythonanywhere.com/api/empleados/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedEmployeeData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar los datos del empleado');
      }
      const updatedData = await response.json();
      onSave(updatedData);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Editar Perfil</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={employeeData.nombre || ''}
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
              value={employeeData.apellido_1 || ''}
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
              value={employeeData.apellido_2 || ''}
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
              value={employeeData.email || ''}
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
              value={employeeData.telefono || ''}
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
