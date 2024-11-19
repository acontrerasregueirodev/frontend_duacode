import React, { useEffect, useRef, useState } from "react";
import './LectorQr.css';
import Perfil from './Perfil';

const LectorQr = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);

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
  }, [isAuthenticated]);

  const handleSubmit = async () => {
    const response = await fetch("http://belami.pythonanywhere.com/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": csrfToken,
      },
      body: new URLSearchParams({
        username: username,
        password: password,
      }),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      setWelcomeMessage(data.message);
      setIsAuthenticated(true);
    } else {
      const errorData = await response.json();
      setWelcomeMessage(errorData.message || "Error al iniciar sesión");
    }
  };

  useEffect(() => {
    if (qrScanned && username && password) {
      handleSubmit();
    }
  }, [qrScanned, username, password]);

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
