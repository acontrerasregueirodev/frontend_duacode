import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PanelSalas.css';


const TarjetaReserva = ({ reserva, empleados, alEliminar, alEditar }) => {
    const asistentes = reserva.empleados_asistentes.map(id => {
        const empleado = empleados.find(emp => emp.id === id);
        return empleado ? `${empleado.nombre} ${empleado.apellido_1} ${empleado.apellido_2}` : 'Desconocido';
    });

    return (
        <div className="tarjeta-reserva">
            <div className="encabezado-reserva">
                <div className="info-sala">
                    <span className="nombre-sala">Sala: {reserva.sala}</span> | 
                    <span className="sede">Sede: {reserva.sede}</span>
                </div>
                <div className="fecha-hora">
                    <div className="fecha-reserva">Fecha: {reserva.fecha}</div>
                    <div className="hora-reserva">
                        Hora de Inicio: {reserva.hora_inicio} - Hora de Fin: {reserva.hora_fin}
                    </div>
                </div>
                <div className="reservado-por">
                    <strong>Reservado por:</strong> {reserva.reservado_por}
                </div>
                <div className="asistentes">
                    <h4>Asistentes:</h4>
                    <ul>
                        {asistentes.length > 0 ? (
                            asistentes.map((nombre, indice) => (
                                <li key={indice}>{nombre}</li>
                            ))
                        ) : (
                            <p>No hay asistentes</p>
                        )}
                    </ul>
                </div>
            </div>
            <div className="botones-editar">
                <button onClick={() => alEditar(reserva)}>Editar Reserva</button>
                <button onClick={() => alEliminar(reserva.id)}>Eliminar Reserva</button>
            </div>
        </div>
    );
};

const ListaReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [salas, setSalas] = useState([]);
    const [reservaParaEditar, setReservaParaEditar] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [modoCreacion, setModoCreacion] = useState(false);

    useEffect(() => {
        axios.get('/api/sedes/reservas')
            .then(respuesta => {
                setReservas(respuesta.data);
                console.log('Reservas:', respuesta.data);
            })
            .catch(error => {
                console.error('Error al obtener las reservas:', error);
            });

        axios.get('/api/empleados/')
            .then(respuesta => {
                setEmpleados(respuesta.data);
            })
            .catch(error => {
                console.error('Error al obtener empleados:', error);
            });

        axios.get('/api/sedes/salas') // Obtener las salas disponibles
            .then(respuesta => {
                setSalas(respuesta.data);
            })
            .catch(error => {
                console.error('Error al obtener las salas:', error);
            });
    }, []);

    const manejarEliminar = async (id) => {
        try {
            const tokenCsrf = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))?.split('=')[1];

            await axios.delete(`http://belami.pythonanywhere.com/api/sedes/reservas/${id}/`, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': tokenCsrf
                }
            });

            setReservas((reservasPrevias) => reservasPrevias.filter(reserva => reserva.id !== id));
            alert('Reserva eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar la reserva:', error);
            alert('No se pudo eliminar la reserva');
        }
    };

    const abrirFormularioEdicion = (reserva) => {
        setReservaParaEditar(reserva);
        setModoEdicion(true);
    };

const guardarReservaEditada = async (evento) => {
    evento.preventDefault();
    const datosFormulario = new FormData(evento.target);
    const empleadosAsistentesIds = Array.from(datosFormulario.getAll('empleados_asistentes'));

    const asistentesCompletos = empleadosAsistentesIds.map(id => {
        const empleado = empleados.find(emp => emp.id === parseInt(id));
        return empleado ? `${empleado.nombre} ${empleado.apellido_1} ${empleado.apellido_2}` : 'Desconocido';
    });

    const reservaActualizada = {
        ...reservaParaEditar,
        fecha: datosFormulario.get('fecha'),
        hora_inicio: datosFormulario.get('hora_inicio'),
        hora_fin: datosFormulario.get('hora_fin'),
        empleados_asistentes: empleadosAsistentesIds,
        sala: datosFormulario.get('sala') // Obtener el ID de la sala seleccionada
    };

    try {
        const tokenCsrf = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))?.split('=')[1];

        await axios.put(`http://belami.pythonanywhere.com/api/sedes/reservas/${reservaParaEditar.id}/`, reservaActualizada, {
            withCredentials: true,
            headers: {
                'X-CSRFToken': tokenCsrf
            }
        });

        setReservas((reservasPrevias) =>
            reservasPrevias.map((reserva) =>
                reserva.id === reservaParaEditar.id
                    ? { 
                        ...reservaActualizada, 
                        empleados_asistentes: asistentesCompletos // Actualizamos los asistentes con los nombres
                    }
                    : reserva
            )
        );

        setModoEdicion(false);
        alert('Reserva editada exitosamente');
    } catch (error) {
        console.error('Error al editar la reserva:', error);
        alert('No se pudo editar la reserva');
    }
};
    const manejarCreacionReserva = async (evento) => {
        evento.preventDefault();
        const datosFormulario = new FormData(evento.target);
        const empleadosAsistentesIds = Array.from(datosFormulario.getAll('empleados_asistentes'));

        const nuevaReserva = {
            fecha: datosFormulario.get('fecha'),
            hora_inicio: datosFormulario.get('hora_inicio'),
            hora_fin: datosFormulario.get('hora_fin'),
            empleados_asistentes: empleadosAsistentesIds,
            sala: datosFormulario.get('sala') // Agregar el ID de la sala seleccionada
        };

        try {
            const tokenCsrf = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))?.split('=')[1];

            const respuesta = await axios.post('http://belami.pythonanywhere.com/api/sedes/reservas/', nuevaReserva, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': tokenCsrf
                }
            });

            setReservas([...reservas, respuesta.data]);
            setModoCreacion(false);
            alert('Reserva creada exitosamente');
        } catch (error) {
            console.error('Error al crear la reserva:', error);
            alert('No se pudo crear la reserva');
        }
    };

    return (
        <div className="contenedor-reservas">
            <div className="encabezado-reservas">
                <h2>Lista de Reservas de Salas</h2>
                <button onClick={() => setModoCreacion(true)}>Añadir Reserva</button>
            </div>

            {reservas.map((reserva) => (
                <TarjetaReserva
                    key={reserva.id}
                    reserva={reserva}
                    empleados={empleados}
                    alEliminar={manejarEliminar}
                    alEditar={abrirFormularioEdicion}
                />
            ))}

            {modoEdicion && reservaParaEditar && (
                <form onSubmit={guardarReservaEditada} className="formulario-editar-reserva">
                    <h3>Editar Reserva</h3>
                    <div>
                        <label htmlFor="fecha">Fecha:</label>
                        <input
                            type="date"
                            id="fecha"
                            name="fecha"
                            defaultValue={reservaParaEditar.fecha}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="hora_inicio">Hora Inicio:</label>
                        <input
                            type="time"
                            id="hora_inicio"
                            name="hora_inicio"
                            defaultValue={reservaParaEditar.hora_inicio}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="hora_fin">Hora Fin:</label>
                        <input
                            type="time"
                            id="hora_fin"
                            name="hora_fin"
                            defaultValue={reservaParaEditar.hora_fin}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="sala">Sala:</label>
                        <select name="sala" id="sala" required defaultValue={reservaParaEditar.sala}>
                            {salas.map((sala) => (
                                <option key={sala.id} value={sala.id}>
                                    {sala.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="empleados_asistentes">Empleados Asistentes:</label>
                        <select name="empleados_asistentes" id="empleados_asistentes" multiple>
                            {empleados.map((empleado) => (
                                <option key={empleado.id} value={empleado.id}>
                                    {empleado.nombre} {empleado.apellido_1} {empleado.apellido_2}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">Guardar Cambios</button>
                    <button onClick={() => setModoEdicion(false)}>Cancelar</button>
                </form>
            )}

            {modoCreacion && (
                <form onSubmit={manejarCreacionReserva} className="formulario-editar-reserva">
                    <h3>Añadir Reserva</h3>
                    <div>
                        <label htmlFor="fecha">Fecha:</label>
                        <input type="date" id="fecha" name="fecha" required />
                    </div>
                    <div>
                        <label htmlFor="hora_inicio">Hora Inicio:</label>
                        <input type="time" id="hora_inicio" name="hora_inicio" required />
                    </div>
                    <div>
                        <label htmlFor="hora_fin">Hora Fin:</label>
                        <input type="time" id="hora_fin" name="hora_fin" required />
                    </div>
                    <div>
                        <label htmlFor="sala">Sala:</label>
                        <select name="sala" id="sala" required>
                            {salas.map((sala) => (
                                <option key={sala.id} value={sala.id}>
                                    {sala.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="empleados_asistentes">Empleados Asistentes:</label>
                        <select name="empleados_asistentes" id="empleados_asistentes" multiple>
                            {empleados.map((empleado) => (
                                <option key={empleado.id} value={empleado.id}>
                                    {empleado.nombre} {empleado.apellido_1} {empleado.apellido_2}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">Guardar Reserva</button>
                    <button onClick={() => setModoCreacion(false)}>Cancelar</button>
                </form>
            )}
        </div>
    );
};

export default ListaReservas;
