import React, { useState, useEffect } from 'react';

const EditarPerfil = ({ id, datosEmpleado, alGuardar, alCancelar }) => {
    const [datosEditados, establecerDatosEditados] = useState(datosEmpleado);

    useEffect(() => {
        establecerDatosEditados(datosEmpleado);
    }, [datosEmpleado]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        establecerDatosEditados(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alGuardar(datosEditados); // Enviar los datos editados para guardarlos
    };

    return (
        <div className="editar-perfil-container">
            <h2>Editar Perfil</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={datosEditados.nombre}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="apellido_1">Primer Apellido</label>
                    <input
                        type="text"
                        id="apellido_1"
                        name="apellido_1"
                        value={datosEditados.apellido_1}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={datosEditados.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                        type="text"
                        id="telefono"
                        name="telefono"
                        value={datosEditados.telefono}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="puesto">Puesto</label>
                    <input
                        type="text"
                        id="puesto"
                        name="puesto"
                        value={datosEditados.puesto}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={alCancelar}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default EditarPerfil;

