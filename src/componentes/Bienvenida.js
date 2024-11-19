import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Bienvenida = () => {
  const [welcomeMessage, setWelcomeMessage] = useState(""); // Estado para el mensaje
  const [csrfToken, setCsrfToken] = useState("");  // Estado para el token CSRF

  useEffect(() => {
    //test de vercel
    // Función para obtener el mensaje y el token CSRF
    const fetchWelcomeMessage = async () => {
      try {
        const response = await fetch("https://belami.pythonanywhere.com/", {
          method: "GET",
          // credentials: "include", // Necesario para enviar las cookies de CSRF
        });

        const data = await response.json();
        console.log(data);
        setWelcomeMessage(data.message);  // Establecemos el mensaje
        setCsrfToken(data.csrfToken);  // Establecemos el token CSRF

      } catch (error) {
        console.error("Error al obtener el mensaje:", error);
      }
    };

    fetchWelcomeMessage();
  }, []);  // Este efecto se ejecutará solo una vez cuando el componente se monte

  return (
    <div className="bienvenida">
      <h1>{welcomeMessage && <p>{welcomeMessage}</p>}</h1>
      <Link to="/test">Ir a la página de prueba</Link>
    </div>
  );
}

export default Bienvenida;
