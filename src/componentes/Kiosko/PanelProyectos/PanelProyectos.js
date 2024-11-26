import React, { useEffect, useState } from 'react';
import axiosClient from '../scripts/axiosClient';  // Importa el cliente de axios
import './PanelProyectos.css';

const Proyectos = () => {
    const [proyectos, setProyectos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalNuevoProyectoVisible, setModalNuevoProyectoVisible] = useState(false);
    const [proyectoEditado, setProyectoEditado] = useState(null);
    const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState([]);
    const [nuevoProyecto, setNuevoProyecto] = useState({
        nombre: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        empleados: []
    });

    const obtenerProyectos = async () => {
        try {
            const response = await axiosClient.get('/api/proyectos/');
            setProyectos(Array.isArray(response.data) ? response.data : []);
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener los proyectos:", error);
            setLoading(false);
        }
    };

    const obtenerEmpleados = async () => {
        try {
            const response = await axiosClient.get('/api/empleados/');
            setEmpleados(response.data);
        } catch (error) {
            console.error("Error al obtener los empleados:", error);
        }
    };

    const eliminarProyecto = async (id) => {
        try {
            await axiosClient.delete(`/api/proyectos/${id}/`);
            setProyectos(proyectos.filter(proyecto => proyecto.id !== id));
            alert('Proyecto eliminado exitosamente');
        } catch (error) {
            console.error("Error al eliminar el proyecto:", error);
            alert('No se pudo eliminar el proyecto');
        }
    };

    const editarProyecto = (proyecto) => {
        setProyectoEditado(proyecto);
        setEmpleadosSeleccionados(proyecto.empleados.map((empleado) => empleado.id));
        setModalVisible(true);
    };

    const guardarEdicion = async () => {
        try {
            const empleadosActualizados = empleadosSeleccionados;
            const updatedProyecto = {
                ...proyectoEditado,
                empleados: empleadosActualizados,
            };

            await axiosClient.put(`proyectos/${updatedProyecto.id}/`, updatedProyecto);

            setProyectos(proyectos.map(p => {
                if (p.id === updatedProyecto.id) {
                    return { ...p, empleados: updatedProyecto.empleados.map(id => empleados.find(e => e.id === id)) };
                }
                return p;
            }));

            setModalVisible(false);
            alert('Proyecto editado exitosamente');
        } catch (error) {
            console.error("Error al editar el proyecto:", error);
            alert('No se pudo editar el proyecto');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProyectoEditado({
            ...proyectoEditado,
            [name]: value
        });
    };

    const handleEmpleadoChange = (e, empleadoId) => {
        const { checked } = e.target;
        if (checked) {
            setEmpleadosSeleccionados([...empleadosSeleccionados, empleadoId]);
        } else {
            setEmpleadosSeleccionados(empleadosSeleccionados.filter(id => id !== empleadoId));
        }
    };

    const handleNuevoProyectoChange = (e) => {
        const { name, value } = e.target;
        setNuevoProyecto({
            ...nuevoProyecto,
            [name]: value
        });
    };

    const guardarNuevoProyecto = async () => {
        try {
            await axiosClient.post('proyectos/', nuevoProyecto);
            obtenerProyectos();
            setModalNuevoProyectoVisible(false);
            alert('Nuevo proyecto creado exitosamente');
        } catch (error) {
            console.error("Error al crear el proyecto:", error);
            alert('No se pudo crear el proyecto');
        }
    };

    useEffect(() => {
        obtenerProyectos();
        obtenerEmpleados();
    }, []);

    if (loading) return <p>Cargando proyectos...</p>;

    return (
        <div className="proyectos-container">
            <h2 className="proyectos-header">Lista de Proyectos</h2>
            <button
                className="agregar-proyecto-btn"
                onClick={() => setModalNuevoProyectoVisible(true)}
            >
                Agregar Proyecto
            </button>
            {proyectos.length === 0 ? (
                <p>No hay proyectos disponibles.</p>
            ) : (
                <ul className="proyectos-list">
                    {proyectos.map((proyecto) => (
                        <li key={proyecto.id} className="proyecto-item">
                            <strong>{proyecto.nombre}</strong>
                            <p>{proyecto.descripcion}</p>
                            <p>Fecha de inicio: {new Date(proyecto.fecha_inicio).toLocaleDateString()}</p>
                            <p>Fecha de fin: {proyecto.fecha_fin ? new Date(proyecto.fecha_fin).toLocaleDateString() : 'En progreso'}</p>

                            <div className="empleados-gallery">
                                {proyecto.empleados.map((empleado) => (
                                    <div key={empleado.id} className="empleado-item">
                                        <p>{empleado.nombre} {empleado.apellido_1}</p>
                                        {empleado.foto && (
                                            <img
                                                src={empleado.foto}
                                                alt={`${empleado.nombre} ${empleado.apellido_1}`}
                                                className="empleado-foto"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="buttons-container">
                                <button
                                    className="editar-proyecto-btn"
                                    onClick={() => editarProyecto(proyecto)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="eliminar-proyecto-btn"
                                    onClick={() => eliminarProyecto(proyecto.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal para editar proyecto */}
            {modalVisible && proyectoEditado && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Editar Proyecto</h3>
                        <label>
                            Nombre del Proyecto:
                            <input
                                type="text"
                                name="nombre"
                                value={proyectoEditado.nombre}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Descripción:
                            <textarea
                                name="descripcion"
                                value={proyectoEditado.descripcion}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Fecha de inicio:
                            <input
                                type="date"
                                name="fecha_inicio"
                                value={proyectoEditado.fecha_inicio}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Fecha de fin:
                            <input
                                type="date"
                                name="fecha_fin"
                                value={proyectoEditado.fecha_fin || ''}
                                onChange={handleChange}
                            />
                        </label>

                        {/* Lista de empleados disponibles */}
                        <div className="empleados-no-asignados">
                            <h4>Empleados</h4>
                            {empleados.map((empleado) => (
                                <div key={empleado.id}>
                                    <input
                                        type="checkbox"
                                        id={`empleado-${empleado.id}`}
                                        checked={empleadosSeleccionados.includes(empleado.id)}
                                        onChange={(e) => handleEmpleadoChange(e, empleado.id)}
                                    />
                                    <label htmlFor={`empleado-${empleado.id}`}>
                                        {empleado.nombre} {empleado.apellido_1}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <button onClick={guardarEdicion}>Guardar cambios</button>
                        <button onClick={() => setModalVisible(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {/* Modal para crear un nuevo proyecto */}
            {modalNuevoProyectoVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Nuevo Proyecto</h3>
                        <label>
                            Nombre del Proyecto:
                            <input
                                type="text"
                                name="nombre"
                                value={nuevoProyecto.nombre}
                                onChange={handleNuevoProyectoChange}
                            />
                        </label>
                        <label>
                            Descripción:
                            <textarea
                                name="descripcion"
                                value={nuevoProyecto.descripcion}
                                onChange={handleNuevoProyectoChange}
                            />
                        </label>
                        <label>
                            Fecha de inicio:
                            <input
                                type="date"
                                name="fecha_inicio"
                                value={nuevoProyecto.fecha_inicio}
                                onChange={handleNuevoProyectoChange}
                            />
                        </label>
                        <label>
                            Fecha de fin:
                            <input
                                type="date"
                                name="fecha_fin"
                                value={nuevoProyecto.fecha_fin}
                                onChange={handleNuevoProyectoChange}
                            />
                        </label>

                        <div className="empleados-no-asignados">
                            <h4>Empleados</h4>
                            {empleados.map((empleado) => (
                                <div key={empleado.id}>
                                    <input
                                        type="checkbox"
                                        id={`empleado-nuevo-${empleado.id}`}
                                        checked={nuevoProyecto.empleados.includes(empleado.id)}
                                        onChange={(e) => {
                                            const { checked } = e.target;
                                            const updatedEmpleados = checked
                                                ? [...nuevoProyecto.empleados, empleado.id]
                                                : nuevoProyecto.empleados.filter(id => id !== empleado.id);
                                            setNuevoProyecto({ ...nuevoProyecto, empleados: updatedEmpleados });
                                        }}
                                    />
                                    <label htmlFor={`empleado-nuevo-${empleado.id}`}>
                                        {empleado.nombre} {empleado.apellido_1}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <button onClick={guardarNuevoProyecto}>Crear Proyecto</button>
                        <button onClick={() => setModalNuevoProyectoVisible(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Proyectos;
