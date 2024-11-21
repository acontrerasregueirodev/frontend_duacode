import React, { useState, useEffect } from 'react';
import './PanelEmpleados.css';
import axios from 'axios'
// Configurar axios globalmente para siempre enviar las credenciales
// Función para obtener el token CSRF desde las cookies
const getCsrfToken = () => {
  const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  return csrfToken ? csrfToken.split('=')[1] : null;
};
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-CSRFToken'] = getCsrfToken();  // Establecer token CSRF globalmente
console.log(getCsrfToken())


const PanelEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    id: null, // Añadir id para editar
    nombre: '',
    apellido_1: '',
    apellido_2: '',
    email: '',
    telefono: '',
    fecha_contratacion: '',
    cumpleaños: '',
    is_on_leave: false,
    rol: { id: '', nombre: '' },
    sede: '',
    foto: null,
  });
  const [error, setError] = useState(null);

  const API_URL = 'https://belami.pythonanywhere.com/api/empleados/';

  // Define ROL_CHOICES here
  const ROL_CHOICES = [
    { id: 1, nombre: 'CEO', label: 'CEO' },
    { id: 2, nombre: 'CTO', label: 'CTO' },
    { id: 3, nombre: 'CFO', label: 'CFO' },
    { id: 4, nombre: 'LÍDER_DESARROLLO', label: 'Líder de desarrollo' },
    { id: 5, nombre: 'INGENIERO_FRONTEND', label: 'Ingeniero de Frontend' },
    { id: 6, nombre: 'INGENIERO_BACKEND', label: 'Ingeniero de Backend' },
    { id: 7, nombre: 'LÍDER_QA', label: 'Líder de QA' },
    { id: 8, nombre: 'INGENIERO_QA', label: 'Ingeniero de QA' },
    { id: 9, nombre: 'GERENTE_PROYECTO', label: 'Gerente de Proyecto' },
    { id: 10, nombre: 'COORDINADOR_PROYECTO', label: 'Coordinador de Proyecto' },
    { id: 11, nombre: 'GERENTE_PRODUCTO', label: 'Gerente de Producto' },
    { id: 12, nombre: 'PROPIETARIO_PRODUCTO', label: 'Propietario de Producto' },
    { id: 13, nombre: 'GERENTE_MARKETING', label: 'Gerente de Marketing' },
    { id: 14, nombre: 'ESPECIALISTA_MARKETING', label: 'Especialista en Marketing Digital' },
    { id: 15, nombre: 'GERENTE_VENTAS', label: 'Gerente de Ventas' },
    { id: 16, nombre: 'REPRESENTANTE_VENTAS', label: 'Representante de Ventas' },
    { id: 17, nombre: 'GERENTE_SOPORTE', label: 'Gerente de Soporte' },
    { id: 18, nombre: 'ESPECIALISTA_SOPORTE', label: 'Especialista en Soporte al Cliente' }
  ];

  const leerEmpleados = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar datos');
      const data = await response.json();
      setEmpleados(data);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    leerEmpleados();
  }, []);
axios.defaults.withCredentials = true;

const eliminarEmpleado = async (empleadoId) => {
  console.log(document.cookie); // Muestra las cookies para depuración
  console.log("token csrf :", getCsrfToken()); // Muestra el token CSRF

  try {
    const csrfToken = getCsrfToken(); // Asegúrate de que esta función obtenga correctamente el token CSRF

    if (!csrfToken) {
      throw new Error('No se pudo obtener el token CSRF');
    }

    const response = await axios.delete(`${API_URL}${empleadoId}/`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, // Enviamos el token CSRF en las cabeceras
      },
      withCredentials: true, // Asegura que las cookies y credenciales sean incluidas
    });

    // Verifica si la solicitud fue exitosa (status 204: No Content significa que se eliminó correctamente)
    if (response.status !== 204) {
      throw new Error('Error al eliminar empleado');
    }

    // Recargar empleados después de la eliminación
    await leerEmpleados(); // Llama a la función que recarga la lista de empleados
    alert("Empleado eliminado con éxito.");
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    alert("No se pudo eliminar el empleado.");
  }
};




const agregarEmpleado = async () => {
  const empleadoData = new FormData();
  empleadoData.append('nombre', nuevoEmpleado.nombre);
  empleadoData.append('apellido_1', nuevoEmpleado.apellido_1);
  empleadoData.append('apellido_2', nuevoEmpleado.apellido_2);
  empleadoData.append('email', nuevoEmpleado.email);
  empleadoData.append('telefono', nuevoEmpleado.telefono);
  empleadoData.append('fecha_contratacion', nuevoEmpleado.fecha_contratacion || '');
  empleadoData.append('cumpleaños', nuevoEmpleado.cumpleaños || '');
  empleadoData.append('is_on_leave', nuevoEmpleado.is_on_leave);
  empleadoData.append('rol', nuevoEmpleado.rol.id);
  empleadoData.append('cd ..sede', nuevoEmpleado.sede || '');
  if (nuevoEmpleado.foto) {
    empleadoData.append('foto', nuevoEmpleado.foto);
  }

  try {
    const response = nuevoEmpleado.id 
      ? await fetch(`${API_URL}${nuevoEmpleado.id}/`, {
          method: 'PUT',
          headers: {
            'X-CSRFToken': getCsrfToken(),
          },
          credentials: 'include',
          body: empleadoData,
        })
      : await fetch(API_URL, {
          method: 'POST',
          headers: {
            'X-CSRFToken': getCsrfToken(),
          },
          credentials: 'include',
          body: empleadoData,
        });
        console.log('actualizando ',empleadoData)
    if (!response.ok) throw new Error('Error al guardar empleado');

    await leerEmpleados();
    setNuevoEmpleado({
      id: null,
      nombre: '',
      apellido_1: '',
      apellido_2: '',
      email: '',
      telefono: '',
      fecha_contratacion: '',
      cumpleaños: '',
      is_on_leave: false,
      rol: { id: '', nombre: '' },
      sede: '',
      foto: null,
    });
    alert(nuevoEmpleado.id ? 'Empleado actualizado con éxito' : 'Empleado agregado con éxito');
  } catch (error) {
    console.error('Error al agregar/actualizar empleado:', error);
    alert('No se pudo agregar/actualizar el empleado. Por favor, verifica los datos.');
  }
};

const manejarInputs = (key, value) => {
  if (key === 'rol') {
    const selectedRol = ROL_CHOICES.find(rol => rol.id === parseInt(value, 10)); // parseamos value como número
    setNuevoEmpleado(prev => ({
      ...prev,
      rol: selectedRol ? { id: selectedRol.id, nombre: selectedRol.nombre } : { id: '', nombre: '' },
    }));
  } else {
    setNuevoEmpleado(prev => ({
      ...prev,
      [key]: value,
    }));
  }
};

const editarEmpleado = (empleado) => {
  setNuevoEmpleado({
    id: empleado.id,
    nombre: empleado.nombre,
    apellido_1: empleado.apellido_1,
    apellido_2: empleado.apellido_2,
    email: empleado.email,
    telefono: empleado.telefono,
    fecha_contratacion: empleado.fecha_contratacion || '',
    cumpleaños: empleado.cumpleaños || '',
    is_on_leave: empleado.is_on_leave,
    rol: empleado.rol ? { id: empleado.rol.id, nombre: empleado.rol.nombre } : { id: '', nombre: '' },
    sede: empleado.sede || '',
    foto: empleado.foto || null,
  });
};

return (
  <div className="section full">
    <h2>Lista de Empleados</h2>
    <div className="nuevo-empleado">
      <h3>{nuevoEmpleado.id ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}</h3>
      <input type="text" placeholder="Nombre" value={nuevoEmpleado.nombre} onChange={(e) => manejarInputs('nombre', e.target.value)} />
      <input type="text" placeholder="Apellido 1" value={nuevoEmpleado.apellido_1} onChange={(e) => manejarInputs('apellido_1', e.target.value)} />
      <input type="text" placeholder="Apellido 2" value={nuevoEmpleado.apellido_2} onChange={(e) => manejarInputs('apellido_2', e.target.value)} />
      <input type="email" placeholder="Email" value={nuevoEmpleado.email} onChange={(e) => manejarInputs('email', e.target.value)} />
      <input type="text" placeholder="Teléfono" value={nuevoEmpleado.telefono} onChange={(e) => manejarInputs('telefono', e.target.value)} />
      <input type="date" placeholder="Fecha Contratación" value={nuevoEmpleado.fecha_contratacion} onChange={(e) => manejarInputs('fecha_contratacion', e.target.value)} />
      <input type="date" placeholder="Cumpleaños" value={nuevoEmpleado.cumpleaños} onChange={(e) => manejarInputs('cumpleaños', e.target.value)} />
      
      {/* Select de rol */}
      <select value={String(nuevoEmpleado.rol.id) || ''} onChange={(e) => manejarInputs('rol', e.target.value)}>

        <option value="">Selecciona un rol</option>
        {ROL_CHOICES.map(rol => (
          <option key={rol.id} value={rol.id}>{rol.label}</option>
        ))}
      </select>
      
      <input type="text" placeholder="Sede" value={nuevoEmpleado.sede} onChange={(e) => manejarInputs('sede', e.target.value)} />
      <input type="file" onChange={(e) => manejarInputs('foto', e.target.files[0])} />
      <button onClick={agregarEmpleado}>{nuevoEmpleado.id ? 'Actualizar Empleado' : 'Agregar Empleado'}</button>
    </div>

    <div className="lista-empleados">
      <h3>Empleados Actuales</h3>
      <ul>
        {empleados.map(empleado => (
          <li key={empleado.id}>
            <span>{empleado.nombre} {empleado.apellido_1} {empleado.apellido_2}</span>
            {empleado.foto && <img src={empleado.foto} alt={`${empleado.nombre} ${empleado.apellido_1}`} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />}
            <button onClick={() => editarEmpleado(empleado)}>Editar</button>
            <button onClick={() => eliminarEmpleado(empleado.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
};

export default PanelEmpleados;