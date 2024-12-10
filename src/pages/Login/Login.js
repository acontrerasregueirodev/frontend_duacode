import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import "./Login.css";
import {useNavigate} from "react-router-dom"
import Cookies from "js-cookie"

const slides = [
  {
    title: "DUACODE",
    description: "Programa rookie",
  },
  {
    title: "UX",
    description: "Profesionales en hacértelo más fácil ;) ",
  },
  {
    title: "Equipo Rookie </>",
    description: "Martin Ois, Adrian Contreras, Mateo Picatoste",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTextHidden, setIsTextHidden] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [qrOverlayVisible, setQrOverlayVisible] = useState(false);
  const webcamRef = useRef(null);
  const [scannedResult, setScannedResult] = useState(null);
  const [socialPopup, setSocialPopup] = useState({ visible: false, type: "" });

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTextHidden(true);
      setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        setIsTextHidden(false);
      }, 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    // Detener la webcam al desmontar el componente
    return () => {
        if (webcamRef.current) {
            const videoTracks = webcamRef.current?.stream?.getTracks();
            if (videoTracks) {
                videoTracks.forEach(track => track.stop()); // Detiene cada track de video
            }
        }
    };
}, []);

  const handleSocialLogin = (platform) => {
    if (platform === "Google") {
      window.location.href =
        "https://accounts.google.com/o/oauth2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email profile";
    } else if (platform === "GitHub") {
      window.location.href =
        "https://github.com/login/oauth/authorize?client_id=YOUR_GITHUB_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=user";
    } else {
      setSocialPopup({ visible: true, type: platform });
    }
  };

const handleLogin = async (e, qrUsername = null, qrPassword = null) => {
  if (e) e.preventDefault(); // Manejo del evento solo si se llama desde el formulario

  const usernameToUse = qrUsername || emailOrUser; // Usa los valores del QR o del formulario
  const passwordToUse = qrPassword || password;

  try {
    const response = await fetch("http://localhost:8000/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: usernameToUse, password: passwordToUse }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Inicio de sesión exitoso", data);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      // Almacena los tokens en las cookies
      Cookies.set('access_token', data.access, { expires: 7, path: '' });
      Cookies.set('refresh_token', data.refresh, { expires: 7, path: '' });
      setErrorMessage("");
      setQrOverlayVisible(false); // Cierra el overlay del QR si estaba activo
      // navigate("/admin/")
      // Redirigir a localhost:8000/dashboard
      window.location.href = 'http://localhost:8000/dashboard';


    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.detail || "Error en las credenciales");
    }
  } catch (err) {
    console.error("Error al iniciar sesión", err);
    setErrorMessage("No se pudo conectar con el servidor");
  }
};


const handleQrScan = (imageData) => {
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  if (code) {
    console.log("Código QR leído:", code.data);

    try {
      const employeeData = JSON.parse(code.data);
      const Username = `${employeeData.nombre}.${employeeData.apellido_1}`.toLowerCase();
      const Password = employeeData.contraseña;

      alert(`Código QR leído correctamente para ${employeeData.nombre}`);
      handleLogin(null, Username, Password); // Llama a handleLogin con los datos del QR
    } catch (error) {
      console.error("Error al leer los datos del QR", error);
      alert("Formato de QR inválido");
    }
  }
};


  const handleActivateCamera = async () => {
    console.log("Intentando activar la cámara...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (stream) {
        console.log("Cámara activada correctamente");
        setQrOverlayVisible(true);

        const interval = setInterval(() => {
          if (webcamRef.current && webcamRef.current.video) {
            const video = webcamRef.current.video;
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            handleQrScan(imageData);
          }
        }, 500); // Revisar cada 500 ms por QR
        return () => clearInterval(interval);
      }
    } catch (err) {
      console.error("No se pudo activar la cámara", err);
      alert("No se pudo activar la cámara. Por favor, verifica tus permisos.");
    }
  };
  // Cierrre de webcam
  const closeScanner = () => {
    setQrOverlayVisible(false); // Cierra el overlay
    setScannedResult(null); // Opcional: Limpiar el resultado escaneado

  };
  const handleSubmit = async () => {
    const response = await fetch("http://localhost:8000/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: username.toLowerCase(),
        password: password,
      }),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
    } else {
      const errorData = await response.json();
    }
  };

  useEffect(() => {
    if (username && password) {
      handleSubmit();
    }
  }, [username, password]);

  return (
    <div className="login-container">
      <div className="slideshow">
        <h2 className={`slideshow-title ${isTextHidden ? "hidden" : ""}`}>
          {slides[currentSlide].title}
        </h2>
        <p className={`slideshow-description ${isTextHidden ? "hidden" : ""}`}>
          {slides[currentSlide].description}
        </p>
      </div>
      <div className="login-form-container">
        <div className="tabs">
          <h3
            className={`tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Iniciar sesión
          </h3>
          <h3
            className={`tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </h3>
        </div>
        <div className="form-content">
          {isLogin ? (
            <form className="form" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Correo o Usuario"
                className="form-input"
                value={emailOrUser}
                onChange={(e) => setEmailOrUser(e.target.value)}
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMessage && <p className="form-error">{errorMessage}</p>}
              <button type="submit" className="form-button">
                Iniciar sesión
              </button>
              <button
                type="button"
                className="form-button qr-button"
                onClick={handleActivateCamera}
              >
                Iniciar sesión con QR
              </button>
              <div className="social-login">
                <button
                  type="button"
                  className="social-button google-button"
                  onClick={() => handleSocialLogin("Google")}
                >
                  <img
                    src="/iconoGoogle.png"
                    alt="Google Icon"
                    className="social-icon"
                  />
                  Iniciar sesión con Google
                </button>
                <button
                  type="button"
                  className="social-button github-button"
                  onClick={() => handleSocialLogin("GitHub")}
                >
                  <img
                    src="/iconoGit.png"
                    alt="GitHub Icon"
                    className="social-icon"
                  />
                  Iniciar sesión con GitHub
                </button>
              </div>
              <p className="form-forgot">
                <a href="#forgot">¿Olvidaste tu contraseña?</a>
              </p>
            </form>
          ) : (
            <form className="form">
              {/* Registro */}
            </form>
          )}
        </div>
      </div>

      {qrOverlayVisible && (
               <div className="qr-overlay">
          <div className="qr-scanner-container">
            <Webcam
              ref={webcamRef}
              onUserMedia={handleQrScan}
              audio={false}
              screenshotFormat="image/jpeg"
              style={{ width: "100%", height: "auto" }}
            />
            {/* <button className="form-button" onClick={() => setQrActive(false)}> */}
            <button className="form-button" onClick={closeScanner}>
              Cerrar escáner
            </button>
            {scannedResult && (
              <p className="scanned-result">
                Resultado escaneado: {scannedResult}
              </p>
            )}
          </div>
        </div>
      )}

      {socialPopup.visible && (
        <div className="social-popup">
          <p>{`Login con ${socialPopup.type} no disponible en esta demo.`}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
