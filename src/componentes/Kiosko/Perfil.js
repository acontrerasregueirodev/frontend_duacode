import React, { useState, useEffect } from 'react';
import axiosClient from '../Kiosko/scripts/axiosClient'; // Importar axiosClient
import EditarPerfil from './EditarPerfil';
import './Perfil.css';
import axios from 'axios'

// Función para obtener el token CSRF
// Función para obtener el token CSRF de las cookies
const obtenerCsrfToken = () => {
    const name = 'csrftoken='; 
    const value = document.cookie.split(';').find(cookie => cookie.trim().startsWith(name));
    return value ? value.split('=')[1] : '';
};

const Perfil = ({ id, estaAutenticado, alCerrarSesion }) => {
    const [datosEmpleado, establecerDatosEmpleado] = useState(null); // Datos del empleado
    const [error, establecerError] = useState(null); // Manejo de errores
    const [enEdicion, establecerEnEdicion] = useState(false); // Estado de edición

    // Función para obtener los datos del empleado
    const obtenerDatosEmpleado = async () => {
        try {
            const respuesta = await axiosClient.get(`api/empleados/${id}/`); // Usar axiosClient
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
            const respuesta = await axiosClient.post(
                'auth/logout/',
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
            alCerrarSesion(); // Llamar la función para manejar el cierre de sesión (prop de componente padre)
        } catch (error) {
            console.error('Error durante el cierre de sesión:', error.message);
        }
    };

const manejarGuardar = async (datosActualizados) => {
    console.log("Datos enviados para actualizar:", datosActualizados);

    // Obtener el token CSRF desde las cookies
    const csrfToken = obtenerCsrfToken(); // Asegúrate de que esta función obtiene el token correctamente
    console.log("Token CSRF obtenido:", csrfToken);
    
    try {
        // Asegurarse de que axiosClient utilice el token CSRF correcto
        const respuesta = await axiosClient.put(
            `api/empleados/${id}/`, // URL relativa para la API, usando axiosClient
            datosActualizados,
            {
                headers: {
                    'Content-Type': 'application/json', // Solo necesario si es parte de los encabezados
                    'X-CSRFToken': csrfToken, // Añadir manualmente el token CSRF en los encabezados
                },
                withCredentials: true, // Asegurarse de enviar cookies y credenciales
            }
        );

        establecerDatosEmpleado(respuesta.data);
        establecerEnEdicion(false); // Salir del modo edición
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
                    datosEmpleado={datosEmpleado} 
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
                            }}>Modificar Datos</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Perfil;

