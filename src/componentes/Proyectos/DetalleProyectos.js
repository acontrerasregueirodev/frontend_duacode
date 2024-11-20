import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/proyectos/DetalleProyectos.css';

const DetalleProyectos = () => {
    const { id } = useParams();
    const [proyectoDetail, setProyectoDetail] = useState(null);
    const [empleadosNombres, setEmpleadosNombres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingEmpleados, setLoadingEmpleados] = useState(false);
    const [errorEmpleados, setErrorEmpleados] = useState(null);
    const [showDetalles, setShowDetalles] = useState(true);
    const [showEmpleados, setShowEmpleados] = useState(true);

    const fetchEmpleados = async (empleadosIds) => {
        try {
            if (empleadosIds.length === 0) return;
            setLoadingEmpleados(true);
            setEmpleadosNombres([]);
            const empleadosPromises = empleadosIds.map((empleadoId) =>
                axios.get(`https://belami.pythonanywhere.com/api/empleados/${empleadoId}/`)
                    .then(response => {
                        const { nombre, apellido_1, apellido_2 } = response.data;
                        return `${nombre} ${apellido_1} ${apellido_2}`;
                    })
                    .catch(err => {
                        return null;
                    })
            );
            const nombres = await Promise.all(empleadosPromises);
            setEmpleadosNombres(nombres.filter(nombre => nombre !== null));
        } catch (err) {
            setErrorEmpleados(err);
        } finally {
            setLoadingEmpleados(false);
        }
    };

    useEffect(() => {
        const fetchProyecto = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://belami.pythonanywhere.com/api/proyectos/${id}/`);
                setProyectoDetail(response.data);
                if (response.data.empleados && response.data.empleados.length > 0) {
                    const empleadosIds = response.data.empleados;
                    fetchEmpleados(empleadosIds);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProyecto();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error al cargar el proyecto: {error.message}</div>;

    return (
        <div className="detalle-proyecto-container">            <div className="project-title">
                <h1 id="det">{proyectoDetail ? proyectoDetail.nombre : 'Detalles del Proyecto'}</h1>
            </div>
            {proyectoDetail && (
                <div className="detalle-contenedor">
                    <div className={`detalle-info-panel ${showDetalles ? 'expanded' : ''}`}>
                        <button className="toggle-section" onClick={() => setShowDetalles(!showDetalles)}>
                            {showDetalles ? 'Ocultar Detalles del Proyecto' : 'Mostrar Detalles del Proyecto'}
                        </button>
                        {showDetalles && (
                            <div className="detalle-info-box">
                                <p><strong>Descripción:</strong> {proyectoDetail.descripcion}</p>
                                <p><strong>Fecha de Inicio:</strong> {proyectoDetail.fecha_inicio}</p>
                                <p><strong>Fecha de Fin:</strong> {proyectoDetail.fecha_fin || 'En curso'}</p>
                            </div>
                        )}
                    </div>
                    <div className={`empleados-panel ${showEmpleados ? 'expanded' : ''}`}>
                        <button className="toggle-section" onClick={() => setShowEmpleados(!showEmpleados)}>
                            {showEmpleados ? 'Ocultar Empleados' : 'Mostrar Empleados'}
                        </button>
                        {showEmpleados && (
                            <div>
                                {loadingEmpleados ? (
                                    <p>Cargando empleados...</p>
                                ) : errorEmpleados ? (
                                    <p>Error al cargar empleados: {errorEmpleados.message}</p>
                                ) : (
                                    <ul className="empleados-list">
                                        {empleadosNombres.length > 0 ? (
                                            empleadosNombres.map((nombreCompleto, index) => (
                                                <li key={index}>{nombreCompleto}</li>
                                            ))
                                        ) : (
                                            <li>No hay empleados asignados</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetalleProyectos;
