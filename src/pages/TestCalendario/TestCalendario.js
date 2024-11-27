// TestCalendario.js
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'; // Asegúrate de importar Calendar
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './TestCalendario.css';
import './loader.css';

const TestCalendario = () => {
  const [events, setEvents] = useState([]); // Estado para los eventos del calendario
  const [loading, setLoading] = useState(true); // Estado para la carga de datos

  // Función para convertir los datos al formato de react-big-calendar
  const formatData = (reservas) => {
    return reservas.map(event => {
      const startDate = new Date(`${event.fecha}T${event.hora_inicio}`);
      const endDate = new Date(`${event.fecha}T${event.hora_fin}`);

      return {
        start: startDate,
        end: endDate,
        title: `Reservado por: ${event.reservado_por}`,
        resource: event.empleados_asistentes, // Puedes usar esto para mostrar información adicional
        allDay: false,
      };
    });
  };

  // Cargar los eventos cuando el componente se monta
  useEffect(() => {
    // Realizar la solicitud a la API para obtener los datos de la sala
    fetch('http://localhost:8000/api/sedes/salas/1/')
      .then(response => response.json())
      .then(data => {
        // Formatear las reservas para el calendario
        console.log(data.json)
        const formattedEvents = formatData(data.reservas);
        setEvents(formattedEvents); // Guardar los eventos en el estado
        setLoading(false); // Cambiar el estado de carga
      })
      .catch(error => {
        console.error('Error al cargar las reservas:', error);
        setLoading(false);
      });
  }, []); // Dependencias vacías, solo se ejecuta al montar el componente

  // Carga animacion de carga mientras consulta a la bbdd
  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div style={{ height: '600px' }}>
      <Calendar
        events={events} // Los eventos que se van a mostrar
        views={['month', 'week', 'day']} // Las vistas disponibles (mes, semana, día)
        defaultView='month' // Vista predeterminada
        localizer={momentLocalizer(moment)} // Localizador con moment.js
        step={30} // Intervalo de 30 minutos por slot
        timeslots={1} // Cantidad de intervalos de tiempo por día
      />
    </div>
  );
};

export default TestCalendario;
