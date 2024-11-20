// Login.js
import React, { useEffect, useRef, useState } from "react";
import '../styles/Login.css';
import Perfil from './Perfil';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [qrScanned, setQrScanned] = useState(false); 
  const [showQrModal, setShowQrModal] = useState(false);  // Modal para confirmar uso de QR
  const [showVideoPreview, setShowVideoPreview] = useState(false); // Mostrar vista previa de cámara
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  useEffect(() => {
    setCsrfToken(getCookie("csrftoken"));

    const startVideoStream = async () => {
      try {
        videoStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = videoStreamRef.current;
      } catch (err) {
        console.error("Error al acceder a la cámara:", err);
      }
    };

    if (showVideoPreview) {
      startVideoStream();
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@zxing/library@latest";
    script.async = true;
    script.onload = () => {
      const codeReader = new window.ZXing.BrowserQRCodeReader();
      codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          const employeeData = JSON.parse(result.text);
          const newUsername = `${employeeData.nombre}.${employeeData.apellido_1}`;
          const newPassword = employeeData.contraseña;
          setUsername(newUsername);
          setPassword(newPassword);
          setQrScanned(true);
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
  }, [showVideoPreview]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      const response = await fetch('https://belami.pythonanywhere.com/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRFToken': csrfToken,
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setWelcomeMessage(data.message);
        setIsAuthenticated(true);
      } else {
        const errorData = await response.json();
        setWelcomeMessage(errorData.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setWelcomeMessage("Error al iniciar sesión");
    }
  };

  useEffect(() => {
    if (qrScanned && username && password) {
      handleSubmit(); // Autenticación automática al escanear el QR
    }
  }, [qrScanned, username, password]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setWelcomeMessage("");
    setQrScanned(false); 
    setShowVideoPreview(false); // Ocultar vista previa
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleQrLogin = () => {
    setShowQrModal(true); // Mostrar confirmación de QR
  };

  const confirmQrLogin = () => {
    setShowQrModal(false);
    setShowVideoPreview(true); // Iniciar vista previa del video
  };

  if (isAuthenticated && welcomeMessage) {
    return <Perfil id={welcomeMessage} setIsAuthenticated={setIsAuthenticated} onLogout={handleLogout} />;
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>Iniciar Sesión</h2>
        <form id="loginForm" onSubmit={handleSubmit}>
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
          <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>
        <button onClick={handleQrLogin} className="qr-login-button">Iniciar con QR</button>
      </div>

      {showQrModal && (
        <div className="modal">
          <div className="modal-content">
            <p>¿Deseas iniciar sesión con QR?</p>
            <button onClick={confirmQrLogin} className="modal-confirm">Sí</button>
            <button onClick={() => setShowQrModal(false)} className="modal-cancel">No</button>
          </div>
        </div>
      )}

      {showVideoPreview && (
        <div className="video-container">
          <video id="preview" ref={videoRef} width="340" height="270" autoPlay></video>
        </div>
      )}

      {welcomeMessage && <div className="welcome-message">{welcomeMessage}</div>}
    </div>
  );
};

export default Login;
