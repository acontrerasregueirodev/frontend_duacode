// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Calendar from "./Calendar";
// import ErrorMessage from "./ErrorMessage";

// const Reserva = () => {
//   const { salaId } = useParams();
//   const [reservas, setReservas] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchReservas = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/sedes/reservas/');
//         const reservasFormateadas = response.data.map((reserva) => ({
//           id: reserva.id,
//           title: `Reserva Sala ${reserva.sala_id}`,
//           start: reserva.fecha_inicio,
//           end: reserva.fecha_fin,
//         }));
//         setReservas(reservasFormateadas);
//       } catch (error) {
//         setError('Error al cargar las reservas');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReservas();
//   }, [salaId]);

//   if (loading) {
//     return <div>Cargando...</div>;
//   }

//   if (error) {
//     return <ErrorMessage message={error} />;
//   }

//   return (
//     <div>
//       <h1>Reservar Sala</h1>
//       <Calendar reservas={reservas} />
//     </div>
//   );
// };

// export default Reserva;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Calendar from "./Calendar";
import ErrorMessage from "./ErrorMessage";

const Reserva = () => {
  const { salaId } = useParams();
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await axios.get('https://belami.pythonanywhere.com/api/sedes/reservas/');
        const reservasFormateadas = response.data.map((reserva) => ({
          id: reserva.id,
          title: `Reserva Sala ${reserva.sala_id}`,
          start: reserva.fecha_inicio,
          end: reserva.fecha_fin,
        }));
        setReservas(reservasFormateadas);
      } catch (error) {
        setError('Error al cargar las reservas');
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [salaId]);

  const handleDateSelect = async (info) => {
    console.log("Fecha seleccionada:", info); // Agregar log para ver la fecha seleccionada.

    const reservaData = {
      sala_id: salaId,
      fecha_inicio: info.startStr,
      fecha_fin: info.endStr,
    };

    try {
      console.log("Enviando datos a la API:", reservaData); // Verificación de datos a enviar.
      const response = await axios.post('https://belami.pythonanywhere.com/api/reserva/', reservaData);
      
      console.log("Respuesta de la API:", response.data); // Verificación de respuesta del servidor.
      
      const confirmMessage = `Reserva exitosa! ID: ${response.data.id}, Fecha de inicio: ${response.data.fecha_inicio}, Fecha de fin: ${response.data.fecha_fin}`;
      window.prompt(confirmMessage, "Aceptar");

      setReservas((prevReservas) => [
        ...prevReservas,
        {
          id: response.data.id, 
          title: `Reserva Sala ${salaId}`,
          start: response.data.fecha_inicio,
          end: response.data.fecha_fin,
        },
      ]);
    } catch (error) {
      console.error("Error al realizar la reserva:", error); // Verificación de error.
      alert('Error al realizar la reserva');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <h1>Reservar Sala</h1>
      <Calendar reservas={reservas} handleDateSelect={handleDateSelect} />
    </div>
  );
};

export default Reserva;
