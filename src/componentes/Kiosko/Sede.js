import React, { useState, useEffect } from 'react';

const SedesList = () => {
    const [sede, setSede] = useState(null);  // Estado para almacenar una sola sede
    const [loginStatus, setLoginStatus] = useState(null);  // Estado para el estado de sesión

    const getCsrfToken = () => {
        const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        return csrfToken ? csrfToken.split('=')[1] : null;
    };

    // Función para obtener las sedes desde la API
    const fetchSede = async () => {
        try {
            const csrfToken = getCsrfToken();

            const response = await fetch('http://belami.pythonanywhere.com/api/sedes/sedes/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al obtener la sede');
            }

            const data = await response.json();
            console.log("Datos obtenidos:", data);

            // Si la respuesta es un arreglo y contiene al menos una sede
            if (Array.isArray(data) && data.length > 0) {
                setSede(data[0]);  // Establece solo la primera sede
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
            const csrfToken = getCsrfToken();

            const response = await fetch('http://belami.pythonanywhere.com/auth/check_login/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al verificar el estado de la sesión');
            }

            const data = await response.json();
            setLoginStatus(data.mensaje);
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
