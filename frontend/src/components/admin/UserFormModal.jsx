import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../fetchWithAuth';
const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;
import '../../styles/admin/userFormModal.css';
import eye from '../../assets/IMG/ojo.png';

const UserFormModal = ({ isOpen, onClose, userToEdit, onSave }) => {
  const [formData, setFormData] = useState({
    id_usuario: '',
    User: '',
    Password: '',
    registrationDate: new Date().toISOString().split('T')[0],
    CustomerID: '',
    roleID: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roleOptions = [
    'Administrador',
    'Servicio Técnico',
    'Cliente',
  ];

  useEffect(() => {
    if (userToEdit) {
      setFormData(userToEdit);
      setIsEditMode(true);
    } else {
      setFormData({
        id_usuario: '',
        User: '',
        Password: '',
        registrationDate: new Date().toISOString().split('T')[0],
        CustomerID: '',
        roleID: '',
      });
      setIsEditMode(false);
    }
  }, [userToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.User || !formData.Password || !formData.CustomerID || !formData.roleID) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }
    const endpoint = isEditMode ? 'editUserAdmin' : 'createUserAdminView';
    const method = isEditMode ? 'PUT' : 'POST';
    (async () => {
      try {
        const response = await fetchWithAuth(
          `${apiUrl}/api/${endpoint}/`,
          {
            method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('session_token')}`
            },
            body: JSON.stringify(formData)
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert(isEditMode ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
          onSave(formData, isEditMode);
          onClose();
        } else {
          alert(data.message || 'Error al guardar el usuario');
        }
      } catch {
        alert('Error de conexión con el servidor');
      }
    })();
  };

  const today = new Date().toISOString().split('T')[0];

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-user">
      <div className="modal-content-user">
        <div className="modal-header-user">
          <h3>{isEditMode ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
          <button className="close-button-user" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body-user">
          {isEditMode && (
            <div className="form-group-user">
              <label htmlFor="id_usuario">ID de Usuario:</label>
              <input
                type="text"
                id="id_usuario"
                name="id_usuario"
                value={formData.id_usuario}
                disabled
              />
            </div>
          )}
          
          <div className="form-group-user">
            <label htmlFor="User">Usuario:</label>
            <input
              type="text"
              id="User"
              name="User"
              value={formData.User}
              onChange={handleChange}
              placeholder="Ingrese el nombre de usuario"
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="Password">Contraseña:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="Password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Ingrese la contraseña"
              />
              <button
                type="button"
                className="password-toggle-button-modal"
                onClick={togglePasswordVisibility}
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <img src={eye} alt="Toggle password visibility" />
              </button>
            </div>
          </div>
          
          <div className="form-group-user">
            <label htmlFor="registrationDate">Fecha de Registro:</label>
            <input
              type="date"
              id="registrationDate"
              name="registrationDate"
              value={formData.registrationDate}
              onChange={handleChange}
              max={today}
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="CustomerID">ID de Cliente:</label>
            <input
              type="text"
              id="CustomerID"
              name="CustomerID"
              value={formData.CustomerID}
              onChange={handleChange}
              placeholder="Ingrese el ID del cliente"
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="roleID">Rol:</label>
            <select
              id="roleID"
              name="roleID"
              value={formData.roleID}
              onChange={handleChange}
            >
              <option value="">Seleccione un rol</option>
              {roleOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-footer-user">
          <button className="modal-button-user cancel-button-user" onClick={onClose}>Cancelar</button>
          <button className="modal-button-user save-button-user" onClick={handleSave}>
            {isEditMode ? 'Guardar Cambios' : 'Agregar Usuario'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;