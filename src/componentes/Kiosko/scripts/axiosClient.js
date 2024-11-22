import axios from 'axios';

// Crear un cliente de Axios
const axiosClient = axios.create({
  baseURL: 'https://belami.pythonanywhere.com/', // Ajusta la URL base según tu proyecto
  timeout: 10000, // Tiempo de espera en milisegundos
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permite que las cookies (como csrftoken) se envíen en las solicitudes
});

// Interceptor para respuestas
axiosClient.interceptors.response.use(
  (response) => {
    // Si necesitas hacer algo con el token CSRF desde la respuesta (por ejemplo, almacenarlo o verificarlo)
    let token = response.headers['x-csrftoken'] || response.headers['csrf-token'];

    // Si no está en los encabezados, busca en el cuerpo de la respuesta
    if (!token && response.data?.csrfToken) {
      token = response.data.csrfToken;
    }

    if (token) {
      console.log('Token CSRF capturado desde la respuesta:', token);
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
    // No es necesario agregar el token CSRF manualmente si las cookies están configuradas correctamente
    console.log('Enviando solicitud con las credenciales (cookies) necesarias.');

    return config;
  },
  (error) => {
    console.error('Error al realizar la solicitud:', error);
    return Promise.reject(error);
  }
);

export default axiosClient;
