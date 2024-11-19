import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const Bienvenida = () => {
  const [welcomeMessage, setWelcomeMessage] = useState(""); // Estado para el mensaje
  const [csrfToken, setCsrfToken] = useState("");  // Estado para el token CSRF

  useEffect(() => {
    //test de vercel
    // Función para obtener el mensaje y el token CSRF
const fetchWelcomeMessage = async () => {
  try {
    const response = await axios.get("https://belami.pythonanywhere.com/", {
      withCredentials: true, // Esto es necesario para enviar las cookies de CSRF
    });

    // Si la respuesta es exitosa
    console.log(response.data);
    setWelcomeMessage(response.data.message);  // Establecemos el mensaje
    setCsrfToken(response.data.csrfToken);  // Establecemos el token CSRF

  } catch (error) {
    // Si ocurre un error al obtener el mensaje
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
