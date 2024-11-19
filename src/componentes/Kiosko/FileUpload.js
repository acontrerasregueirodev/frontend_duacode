import React, { useState } from 'react';

// Función para obtener el valor de la cookie por nombre
const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const FileUpload = ({ onFileUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [descripcion, setDescripcion] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Por favor, selecciona un archivo para subir.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('descripcion', descripcion);

    // Obtener el token CSRF de las cookies
    const csrfToken = getCookie('csrftoken'); // Llama a la función para obtener el token CSRF

    try {
      const response = await fetch('https://belami.pythonanywhere.com/upload/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken, // Incluye el token CSRF en los encabezados
        },
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json(); // Intenta obtener datos de error
        throw new Error(`Error al subir el archivo: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('Archivo subido:', data);

      // Llamamos a la función para notificar que el archivo se subió con éxito
      // Pasamos el nombre del archivo y la descripción proporcionada por el usuario
      onFileUploadSuccess({ 
        name: file.name, 
        descripcion: descripcion, // Ahora pasamos la descripción
        url: data.url || '' // Asegúrate de que el servidor responda con la URL del archivo
      });

      alert('Archivo subido con éxito.');
      setFile(null);
      setDescripcion('');
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Error al subir el archivo: ' + error.message); // Muestra el mensaje de error
    }
  };

  return (
    <div className="file-upload">
      <h4>Subir Archivo</h4>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={handleDescripcionChange}
        />
        <button type="submit">Subir</button>
      </form>
    </div>
  );
};

export default FileUpload;
