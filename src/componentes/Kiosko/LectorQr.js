import React, { useEffect, useRef, useState } from "react";
import './LectorQr.css';
import Perfil from './Perfil';
import axiosClient from '../Kiosko/scripts/axiosClient'; // Importamos axiosClient

const LectorQr = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);

  // Obtener cookie CSRF
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  useEffect(() => {
    const csrfTokenValue = getCookie("csrftoken");
    setCsrfToken(csrfTokenValue);

    const startVideoStream = async () => {
      try {
        videoStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = videoStreamRef.current;
      } catch (err) {
        console.error("Error al acceder a la cámara:", err);
      }
    };

    if (isAuthenticated) {
      startVideoStream();
    }

    // Cargar la biblioteca de QR
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@zxing/library@latest";
    script.async = true;
    script.onload = () => {
      const codeReader = new window.ZXing.BrowserQRCodeReader();
      codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          try {
            const employeeData = JSON.parse(result.text);
            setUsername(`${employeeData.nombre}.${employeeData.apellido_1}`);
            setPassword(employeeData.contraseña);
            setQrScanned(true);
          } catch (e) {
            console.error("Error al procesar el código QR:", e);
          }
        }
      });
    };
    document.body.appendChild(script);

    return () => {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
      }
      document.body.removeChild(script);
    };
  }, [isAuthenticated]);

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    try {
      const response = await axiosClient.post(
        'auth/login/', 
        new URLSearchParams({
          username: username,
          password: password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken || window.csrfStore.token, // Usar el token CSRF
          },
          withCredentials: true, // Incluir cookies en las solicitudes
        }
      );

      console.log('CSRF Token usado:', csrfToken || window.csrfStore.token);

      if (response.status === 200) {
        console.log(response.data)
        localStorage.setItem('token', response.data.token); // Guardar el token de sesión en localStorage
        setWelcomeMessage(response.data.message);
        setIsAuthenticated(true);
      }
    } catch (error) {
      const errorData = error.response?.data;
      setWelcomeMessage(errorData?.message || 'Error al iniciar sesión');
    }
  };

  // Manejar el inicio de sesión automático tras escanear el QR
  useEffect(() => {
    if (qrScanned && username && password) {
      handleSubmit();
    }
  }, [qrScanned, username, password]);

  // Cerrar sesión
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setWelcomeMessage("");
    setQrScanned(false);
  };

  if (isAuthenticated && welcomeMessage) {
    return <Perfil id={welcomeMessage} setIsAuthenticated={setIsAuthenticated} onLogout={handleLogout} />;
  }

  return (
    <div className="container">
      <div className="video-form-container">
        <div className="video-container">
          <video id="preview" ref={videoRef} autoPlay></video>
          <div className="form-container">
            <div className="form-group">
              <label htmlFor="username">Usuario:</label>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button onClick={handleSubmit} className="submit-button">Iniciar sesión</button>
          </div>
        </div>
      </div>
      {welcomeMessage && <div className="welcome-message">{welcomeMessage}</div>}
    </div>
  );
};

export default LectorQr;
