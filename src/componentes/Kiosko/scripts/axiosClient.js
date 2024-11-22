import axios from 'axios';

// Crear un cliente de Axios
const axiosClient = axios.create({
  baseURL: 'https://belami.pythonanywhere.com/',
  timeout: 10000, // Tiempo de espera en milisegundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inicializa window.csrfStore si no existe
if (!window.csrfStore) {
  window.csrfStore = { token: '' };
}

// Interceptor para respuestas
axiosClient.interceptors.response.use(
  (response) => {
    // Verifica el token CSRF en los encabezados
    let token = response.headers['x-csrftoken'] || response.headers['csrf-token'];

    // Si no está en los encabezados, busca en el cuerpo de la respuesta
    if (!token && response.data?.csrfToken) {
      token = response.data.csrfToken;
    }

    if (token) {
      window.csrfStore.token = token; // Guarda el token globalmente
      console.log('Token CSRF capturado y almacenado:', token);
    } else {
      console.log('No se encontró token CSRF en la respuesta.');
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
    // Adjunta el token CSRF a las solicitudes salientes si está disponible
    const csrfToken = window.csrfStore?.token;
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
      console.log('Token CSRF agregado a la solicitud:', csrfToken);
    } else {
      console.log('No se encontró token CSRF para agregar a la solicitud.');
    }
    return config;
  },
  (error) => {
    console.error('Error al realizar la solicitud:', error);
    return Promise.reject(error);
  }
);

export default axiosClient;
