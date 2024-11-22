import axios from 'axios';

// Crear un cliente de Axios
const axiosClient = axios.create({
  baseURL: 'https://belami.pythonanywhere.com/api',
  timeout: 10000, // Tiempo de espera en milisegundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable para almacenar el token CSRF
let csrfToken = '';

// Interceptor para respuestas
axiosClient.interceptors.response.use(
  (response) => {
    // Verifica si el token CSRF está en los encabezados de la respuesta
    const token = response.headers['x-csrftoken'];
    if (token) {
      csrfToken = token; // Guardar el token en una variable global o donde lo necesites
      console.log('Token CSRF capturado:', csrfToken);
    }
    return response;
  },
  (error) => {
    console.error('Error en la respuesta:', error);
    return Promise.reject(error);
  }
);

// Interceptor para solicitudes
axiosClient.interceptors.request.use(
  (config) => {
    if (csrfToken) {
      // Adjunta el token CSRF a las solicitudes salientes
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
