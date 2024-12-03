import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
// import './AdminEmpleados.css'

const AdminEmpleados = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);  // Estado para mostrar la modal
  const [currentEmployee, setCurrentEmployee] = useState(null); // Estado para almacenar los datos del empleado a editar
  const employeesPerPage = 10;

  useEffect(() => {
    fetch("http://localhost:8000/api/empleados/")
      .then((response) => response.json())
      .then((data) => {
        setEmpleados(data);
        setFilteredEmpleados(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error al obtener los empleados:", error));
  }, []);

useEffect(() => {
  // Verificar si hay un término de búsqueda
  if (searchTerm.trim() === "") {
    setFilteredEmpleados(empleados); // Si no hay término de búsqueda, mostrar todos los empleados
  } else {
const filtered = empleados.filter((empleado) => {
  const fullName = `${empleado.nombre} ${empleado.apellido_1} ${empleado.apellido_2}`.toLowerCase();
  console.log(fullName); // Ver qué nombre completo se está procesando
  return fullName.includes(searchTerm.toLowerCase());
});
    setFilteredEmpleados(filtered);
  }
}, [searchTerm, empleados]);

  const handleEdit = (empleado) => {
    setCurrentEmployee(empleado);  // Establecer el empleado que se va a editar
    setShowModal(true);  // Mostrar la modal
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      fetch(`http://localhost:8000/api/empleados/${id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            setEmpleados((prev) => prev.filter((emp) => emp.id !== id));
          } else if (response.status === 401) {
            return fetch("http://localhost:8000/auth/token/refresh/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: refreshToken }),
            })
              .then((res) => res.json())
              .then((data) => {
                localStorage.setItem("access_token", data.access);
                return fetch(`http://localhost:8000/api/empleados/${id}/`, {
                  method: "DELETE",
                  headers: {
                    "Authorization": `Bearer ${data.access}`,
                    "Content-Type": "application/json",
                  },
                });
              });
          } else {
            throw new Error("Error al eliminar el empleado");
          }
        })
        .catch((error) => console.error("Error al eliminar el empleado:", error));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentEmployee(null); // Limpiar los datos del empleado
  };

  const handleSave = () => {
    // Verifica que el id del empleado esté presente
    if (!currentEmployee.id) {
      alert("El ID del empleado no es válido.");
      return;
    }

    // Crear un objeto FormData
    const formData = new FormData();
    formData.append("nombre", currentEmployee.nombre);
    formData.append("apellido_1", currentEmployee.apellido_1);
    formData.append("apellido_2", currentEmployee.apellido_2);
    formData.append("email", currentEmployee.email);
    formData.append("telefono", currentEmployee.telefono);
    formData.append("rol", JSON.stringify({ id: currentEmployee.rol.id }));
    formData.append("sede", currentEmployee.sede);
    formData.append("baja", currentEmployee.baja);
    formData.append("excedencia", currentEmployee.excedencia);
    formData.append("teletrabajo", currentEmployee.teletrabajo);
    formData.append("vacaciones", currentEmployee.vacaciones);

    // Asegurarse de agregar las fotos solo si están presentes
    if (currentEmployee.foto) {
      const fotoFile = currentEmployee.foto;
      formData.append("foto", fotoFile);
    }

    if (currentEmployee.qr_code) {
      const qrCodeFile = currentEmployee.qr_code;
      formData.append("qr_code", qrCodeFile);
    }

    // Obtener el token de acceso
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      alert("No se encontró un token de acceso válido.");
      return;
    }

    // Enviar los datos actualizados al backend
    fetch(`http://localhost:8000/api/empleados/${currentEmployee.id}/`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      body: formData, // Enviar como FormData
    })
      .then((response) => {
        if (response.ok) {
          setEmpleados((prev) =>
            prev.map((emp) =>
              emp.id === currentEmployee.id ? { ...emp, ...currentEmployee } : emp
            )
          );
          closeModal();
        } else {
          return response.json().then((data) => {
            alert(`Error: ${data.detail || "Hubo un error al actualizar el empleado."}`);
          });
        }
      })
      .catch((error) => console.error("Error al actualizar el empleado:", error));
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmpleados.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-5 ms-5">
      <Row className="mb-3">
        <Col>
          <h2>Administracion de Empleados</h2>
        </Col>
        <Col className="text-end">
          <Form.Control
            type="text"
            placeholder="Buscar empleado..."
            className="me-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ display: 'inline-block', width: 'auto' }}
          />
          <Button variant="primary" className="me-2" onClick={() => navigate('/empleados/nuevo')}>
            Nuevo Empleado
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Volver
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Sede</th>
            <th>Baja</th>
            <th>Excedencia</th>
            <th>Teletrabajo</th>
            <th>Vacaciones</th>
            <th>Foto</th>
            <th style={{ whiteSpace: "nowrap" }}>Código QR</th>
            <th>Acciones</th>
          </tr>
        </thead>
      <tbody>
  {currentEmployees.length > 0 ? (
    currentEmployees.map((empleado) => (
      <tr key={empleado.id}>
        <td>{empleado.id}</td>
        <td>{empleado.nombre}</td>
        <td style={{ whiteSpace: "nowrap" }}>
          {empleado.apellido_1} {empleado.apellido_2}
        </td>
        <td>{empleado.email}</td>
        <td>{empleado.telefono}</td>
        <td>{empleado.rol?.nombre || "Sin rol"}</td>
        <td>{empleado.sede}</td>
        <td className="text-center">{empleado.baja ? "Sí" : "No"}</td>
        <td className="text-center">{empleado.excedencia ? "Sí" : "No"}</td>
        <td className="text-center">{empleado.teletrabajo ? "Sí" : "No"}</td>
        <td className="text-center">{empleado.vacaciones ? "Sí" : "No"}</td>
        <td className="text-center">
          {empleado.foto && (
            <img
              src={`http://localhost:8000/media/${empleado.foto}`}
              alt="Foto"
              width="50"
            />
          )}
        </td>
        <td className="text-center">
          {empleado.qr_code && (
            <img
              src={`http://localhost:8000/media/${empleado.qr_code}`}
              alt="QR"
              width="50"
            />
          )}
        </td>
        <td>
          <div className="d-flex">
            <Button
              variant="warning"
              onClick={() => handleEdit(empleado)}
              className="me-2"
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button variant="danger" onClick={() => handleDelete(empleado.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="14" className="text-center">
        No hay empleados disponibles.
      </td>
    </tr>
  )}
</tbody>


      </Table>

      {/* Paginación */}
      <div className="d-flex justify-content-center mb-3">
<Button
  variant="secondary"
  onClick={() => paginate(currentPage - 1)}
  disabled={currentPage === 1}
  className="me-3" // Añadir margen a la derecha
>
  Anterior
</Button>
<Button
  variant="secondary"
  onClick={() => paginate(currentPage + 1)}
  disabled={currentPage === Math.ceil(filteredEmpleados.length / employeesPerPage)}
>
  Siguiente
</Button>
      </div>

{/* Modal de Edición de Empleado */}
{showModal && currentEmployee && (
  <Modal show={showModal} onHide={closeModal}>
    <Modal.Header closeButton>
      <Modal.Title>Editar Empleado</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {/* Formulario para editar el empleado */}
      <Form>
        <Row>
          {/* Primera columna */}
          <Col md={6}>
            <Form.Group controlId="formNombre" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={currentEmployee.nombre}
                onChange={(e) =>
                  setCurrentEmployee({ ...currentEmployee, nombre: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formApellido1" className="mb-3">
              <Form.Label>Apellido 1</Form.Label>
              <Form.Control
                type="text"
                value={currentEmployee.apellido_1}
                onChange={(e) =>
                  setCurrentEmployee({ ...currentEmployee, apellido_1: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentEmployee.email}
                onChange={(e) =>
                  setCurrentEmployee({ ...currentEmployee, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formRol" className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                as="select"
                value={currentEmployee.rol.id}
                onChange={(e) =>
                  setCurrentEmployee({
                    ...currentEmployee,
                    rol: { ...currentEmployee.rol, id: parseInt(e.target.value) },
                  })
                }
              >
                <option value={1}>Administrador</option>
                <option value={2}>Empleado</option>
                <option value={3}>Supervisor</option>
              </Form.Control>
            </Form.Group>
          </Col>

          {/* Segunda columna */}
          <Col md={6}>
            <Form.Group controlId="formApellido2" className="mb-3">
              <Form.Label>Apellido 2</Form.Label>
              <Form.Control
                type="text"
                value={currentEmployee.apellido_2}
                onChange={(e) =>
                  setCurrentEmployee({ ...currentEmployee, apellido_2: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTelefono" className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={currentEmployee.telefono}
                onChange={(e) =>
                  setCurrentEmployee({ ...currentEmployee, telefono: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formSede" className="mb-3">
              <Form.Label>Sede</Form.Label>
              <Form.Control
                as="select"
                value={currentEmployee.sede || ""}
                onChange={(e) =>
                  setCurrentEmployee({
                    ...currentEmployee,
                    sede: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Selecciona una sede</option>
                <option value={1}>Sede Principal</option>
                <option value={2}>Sede Secundaria</option>
                <option value={3}>Sede Internacional</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* Opciones de estado */}
          <Col md={6}>
            <Form.Check
              type="checkbox"
              label="Baja"
              className="mb-3"
              checked={currentEmployee.baja}
              onChange={(e) =>
                setCurrentEmployee({ ...currentEmployee, baja: e.target.checked })
              }
            />
            <Form.Check
              type="checkbox"
              label="Excedencia"
              className="mb-3"
              checked={currentEmployee.excedencia}
              onChange={(e) =>
                setCurrentEmployee({ ...currentEmployee, excedencia: e.target.checked })
              }
            />
          </Col>
          <Col md={6}>
            <Form.Check
              type="checkbox"
              label="Teletrabajo"
              className="mb-3"
              checked={currentEmployee.teletrabajo}
              onChange={(e) =>
                setCurrentEmployee({ ...currentEmployee, teletrabajo: e.target.checked })
              }
            />
            <Form.Check
              type="checkbox"
              label="Vacaciones"
              className="mb-3"
              checked={currentEmployee.vacaciones}
              onChange={(e) =>
                setCurrentEmployee({ ...currentEmployee, vacaciones: e.target.checked })
              }
            />
          </Col>
        </Row>

        <Row>
          {/* Archivos */}
          <Col md={6}>
            <Form.Group controlId="formFoto" className="mb-3">
              <Form.Label>Foto</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) =>
                  setCurrentEmployee({ ...currentEmployee, foto: e.target.files[0] })
                }
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formQrCode" className="mb-3">
              <Form.Label>Código QR</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) =>
                  setCurrentEmployee({ ...currentEmployee, qr_code: e.target.files[0] })
                }
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={closeModal}>
        Cerrar
      </Button>
      <Button variant="primary" onClick={handleSave}>
        Guardar cambios
      </Button>
    </Modal.Footer>
  </Modal>
)}



    </Container>
  );
};

export default AdminEmpleados;
