import React, { useState, useEffect } from 'react';
import axios from 'axios'
const SedesList = () => {
    const [sede, setSede] = useState(null);  // Estado para almacenar una sola sede
    const [loginStatus, setLoginStatus] = useState(null);  // Estado para el estado de sesión

// const getCsrfToken = () => {
//   return document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
// };
// Función para obtener el token CSRF
const obtenerCsrfToken = () => {
    return window.csrfToken;
};


    // Función para obtener las sedes desde la API
    const fetchSede = async () => {
    try {
        const csrfToken = obtenerCsrfToken(); // Asegúrate de tener esta función definida.

        const response = await axios.get('https://belami.pythonanywhere.com/api/sedes/sedes/', {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            withCredentials: true, // Incluye cookies y credenciales
        });

        const data = response.data;
        console.log("Datos obtenidos:", data);

        // Si la respuesta es un arreglo y contiene al menos una sede
        if (Array.isArray(data) && data.length > 0) {
            setSede(data[0]); // Establece solo la primera sede
        } else {
            console.error('No se encontraron sedes:', data);
        }
    } catch (error) {
        console.error('Error al obtener la sede:', error.message);
    }
    };

    useEffect(() => {
        fetchSede();
    }, []);

const handleCheckLogin = async () => {
    try {
        const csrfToken = obtenerCsrfToken();

        const response = await axios.get('https://belami.pythonanywhere.com/auth/check_login/', {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            withCredentials: true, // Esto es equivalente a `credentials: 'include'`
        });

        setLoginStatus(response.data.mensaje);
    } catch (error) {
        console.error('Error al verificar el estado de la sesión:', error.message);
    }
};

    return (
        <div>
            <button onClick={handleCheckLogin} className="check-login-button">
                Verificar si estoy logueado
            </button>

            {loginStatus === null ? (
                <p>Haz clic en el botón para verificar tu estado de sesión.</p>
            ) : (
                <p>{loginStatus}</p>
            )}

            <h2>Detalle de Sede</h2>
            {sede ? (
                <div className="sede">
                    <h3>{sede.nombre || 'Sede sin nombre'}</h3>
                    <p><strong>Dirección:</strong> {sede.direccion || 'No disponible'}</p>
                    <p><strong>Ciudad:</strong> {sede.ciudad || 'No disponible'}</p>
                    <p><strong>País:</strong> {sede.pais || 'No disponible'}</p>
                </div>
            ) : (
                <p>No hay datos de sede disponibles.</p>
            )}
        </div>
    );
};

export default SedesList;
