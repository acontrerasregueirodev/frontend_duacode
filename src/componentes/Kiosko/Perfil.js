import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditarPerfil from './EditarPerfil';
import './Perfil.css';

// Función para obtener el token CSRF
const obtenerCsrfToken = () => {
    const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    const csrfToken = csrfCookie ? csrfCookie.split('=')[1] : null;
    console.log("Token CSRF obtenido en obtenerCsrfToken:", csrfToken);
    return csrfToken;
};

const Perfil = ({ id, estaAutenticado, alCerrarSesion }) => {
    const [datosEmpleado, establecerDatosEmpleado] = useState(null); // Datos del empleado
    const [error, establecerError] = useState(null); // Manejo de errores
    const [enEdicion, establecerEnEdicion] = useState(false); // Estado de edición

    // Función para obtener los datos del empleado
    const obtenerDatosEmpleado = async () => {
        try {
            const respuesta = await axios.get(`http://localhost:8000/api/empleados/${id}/`);
            establecerDatosEmpleado(respuesta.data);
        } catch (error) {
            establecerError(error);
        }
    };

    // Llama a obtenerDatosEmpleado al cargar el componente
    useEffect(() => {
        obtenerDatosEmpleado();
    }, [id]);

    // Función para manejar el cierre de sesión
    const manejarCierreSesion = async () => {
        try {
            const csrfToken = obtenerCsrfToken();
            const respuesta = await axios.post(
                'http://localhost:8000/auth/logout/',
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    withCredentials: true,
                }
            );

            if (respuesta.status !== 200) {
                throw new Error('Error durante el cierre de sesión');
            }

            console.log(respuesta.data.message);
        } catch (error) {
            console.error('Error durante el cierre de sesión:', error.message);
        }
    };

    // Función para manejar la actualización de datos
const manejarGuardar = async (datosActualizados) => {
    const csrfToken = obtenerCsrfToken();
    console.log("Token CSRF obtenido:", csrfToken);
    console.log("Datos enviados para actualizar:", datosActualizados);

    try {
        const respuesta = await axios.put(
            `http://localhost:8000/api/empleados/${id}/`,
            datosActualizados,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true,
            }
        );

        establecerDatosEmpleado(respuesta.data);
        establecerEnEdicion(false);
    } catch (error) {
        console.error('Error al actualizar el perfil:', error.message);
    }
};


    // Muestra un mensaje de error si no se pudieron cargar los datos
    if (!datosEmpleado) {
        if (error) return <p>{error.message}</p>;
        return <p>Cargando...</p>;
    }

    return (
        <div className="perfil-container">
            {enEdicion ? (
                <EditarPerfil 
                    id={id} 
                    alGuardar={manejarGuardar} 
                    alCancelar={() => establecerEnEdicion(false)} 
                />
            ) : (
                <>
                    <div className="info-section">
                        <h1>Perfil de Empleado</h1>
                        <p>ID del Empleado: {datosEmpleado.id}</p>
                        <p>Nombre: {datosEmpleado.nombre} {datosEmpleado.apellido_1} {datosEmpleado.apellido_2}</p>
                        <p>Email: {datosEmpleado.email}</p>
                        <p>Teléfono: {datosEmpleado.telefono}</p>
                        <p>Puesto: {datosEmpleado.puesto}</p>
                        <p>Fecha de Contratación: {new Date(datosEmpleado.fecha_contratacion).toLocaleDateString()}</p>
                        <p>Cumpleaños: {new Date(datosEmpleado.cumpleaños).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="photo-section">
                        {datosEmpleado.foto && <img src={datosEmpleado.foto} alt={`${datosEmpleado.nombre} ${datosEmpleado.apellido_1}`} />}
                        <div className="buttons-section">
                            <button className="logout-button" onClick={manejarCierreSesion}>Cerrar Sesión</button>
<button className="edit-button" onClick={() => {
    console.log("Haciendo clic en Modificar Datos");
    establecerEnEdicion(true);
}}>Modificar Datos</button>                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Perfil;
