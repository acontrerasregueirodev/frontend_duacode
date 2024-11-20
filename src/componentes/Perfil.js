import React, { useState } from 'react';
import useFetchData from './useFetchData';
import EditarPerfil from './EditarPerfil';
import '../styles/Perfil.css'

// utils/csrfToken.js
export const getCsrfToken = () => {
    const name = 'csrftoken';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const Perfil = ({ id, setIsAuthenticated, onLogout }) => {
    const { data: employeeData, error, refetch } = useFetchData(`https://belami.pythonanywhere.com/api/empleados/${id}/`);
    const [isEditing, setIsEditing] = useState(false);

    const handleLogout = async () => {
        try {
            const csrfToken = getCsrfToken();
            const response = await fetch('hhttps://belami.pythonanywhere.com/auth/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Error durante el logout');
            }

            const data = await response.json();
            console.log(data.message);

        } catch (error) {
            console.error('Error durante el logout:', error.message);
        }
    };

    const handleSave = async (updatedData) => {
        await refetch();
        setIsEditing(false);
    };

    if (!employeeData) {
        if (error) return <p>{error.message}</p>;
        return <p>Cargando...</p>;
    }

    return (
        <div className="perfil-container">
            {isEditing ? (
                <EditarPerfil 
                    id={id} 
                    onSave={handleSave} 
                    onCancel={() => setIsEditing(false)} 
                />
            ) : (
                <>
                    <div className="info-section">
                        <h1>Perfil de Empleado</h1>
                        <p>ID del Empleado: {employeeData.id}</p>
                        <p>Nombre: {employeeData.nombre} {employeeData.apellido_1} {employeeData.apellido_2}</p>
                        <p>Email: {employeeData.email}</p>
                        <p>Teléfono: {employeeData.telefono}</p>
                        <p>Puesto: {employeeData.rol.nombre}</p>
                        <p>Fecha de Contratación: {new Date(employeeData.fecha_contratacion).toLocaleDateString()}</p>
                        <p>Cumpleaños: {new Date(employeeData.cumpleaños).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="photo-section">
                        {employeeData.foto && <img src={employeeData.foto} alt={`${employeeData.nombre} ${employeeData.apellido_1}`} />}
                        <div className="buttons-section">
                            <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
                            <button className="edit-button" onClick={() => setIsEditing(true)}>Modificar Datos</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Perfil;
