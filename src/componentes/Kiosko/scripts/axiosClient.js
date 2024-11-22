import axios from 'axios';

// Crear un cliente de Axios
const axiosClient = axios.create({
  baseURL: 'https://belami.pythonanywhere.com/',
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
axiosClient.interceptors.response.use(
  (response) => {
    const token = response.headers['x-csrftoken'];
    if (token) {
      window.csrfStore.token = token; // Guarda el token globalmente
      console.log('Token CSRF capturado:', token);
    }
    return response;
  },
  (error) => {
    console.error('Error en la respuesta:', error);
    return Promise.reject(error);
  }
);


export default axiosClient;
