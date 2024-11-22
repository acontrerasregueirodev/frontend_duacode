import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from './Kiosko/scripts/axiosClient'; 

const Bienvenida = () => {
  const [welcomeMessage, setWelcomeMessage] = useState(''); // Estado para el mensaje
  const [csrfToken, setCsrfToken] = useState(''); // Estado para el token CSRF

  useEffect(() => {
    // Función para obtener el mensaje y el token CSRF
    const fetchWelcomeMessage = async () => {
      try {
        const response = await axiosClient.get('/'); // Cambia la URL si es necesario
        console.log('Respuesta recibida:', response.data);

        // Establecemos el mensaje y el token CSRF en el estado
        setWelcomeMessage(response.data.message);
        setCsrfToken(response.data.csrfToken);

        // El token ya será usado automáticamente por axiosClient en futuras solicitudes
      } catch (error) {
        console.error('Error al obtener el mensaje:', error);
      }
    };
    // Función para obtener el mensaje y el token CSRF
    // const fetchWelcomeMessage = async () => {
    //   try {
    //     const response = await axiosClient.get('/'); // Cambia la URL si es necesario
    //     console.log('Respuesta recibida:', response.data);

    //     // Establecemos el mensaje y el token CSRF en el estado
    //     setWelcomeMessage(response.data.message);
    //     setCsrfToken(response.data.csrfToken);

    //     // El token ya será usado automáticamente por axiosClient en futuras solicitudes
    //   } catch (error) {
    //     console.error('Error al obtener el mensaje:', error);
    //   }
    // };
    fetchWelcomeMessage();
  }, []); // Ejecuta el efecto solo una vez al montar el componente

  return (
    <div className="bienvenida">
      {welcomeMessage && <p>{welcomeMessage}</p>}
      {csrfToken && <p>Token CSRF capturado: {csrfToken}</p>}
      <Link to="/test">Ir a la página de prueba</Link>
    </div>
  );
};

export default Bienvenida;
