import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../fetchWithAuth';
const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;
import '../../styles/admin/userFormModal.css';
import eye from '../../assets/IMG/ojo.png';
import Cookies from 'js-cookie';

const UserFormModal = ({ isOpen, onClose, userToEdit, onSave }) => {
  const [formData, setFormData] = useState({
    userID: '',
    User: '',
    Password: '',
    registrationDate: new Date().toISOString().split('T')[0],
    CustomerID: '',
    roleID: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [customers, setCustomers] = useState([])

  const roleOptions = [
    'Administrador',
    'Servicio Técnico',
    'Cliente',
  ];

  async function fetchCSRFToken() {
    try {
      const response = await fetch(`${apiUrl}/api/token-getCSRF/`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.csrfToken; // Return the token directly
      } else {
        console.error(`Failed to fetch CSRF token: ${response.status}`);
        return null;
      }
    } catch (error) {
      console.error('Network error fetching CSRF token:', error);
      return null;
    }
  }

  function getCookie(name) {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1];
  }

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetchWithAuth(
          `${apiUrl}/api/adminGetCustomers/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('session_token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        if (response.ok) {
          setCustomers(data);
        } else {
          console.error(data.message || 'Error fetching customers');
        }
      } catch {
        console.error('Error connecting to server');
      }
    }
    fetchCustomers();
  }, [])

  useEffect(() => {
    if (userToEdit) {
      setFormData(userToEdit);
      setIsEditMode(true);
    } else {
      setFormData({
        userID: '',
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

  const handleSave = async () => {
    if (!formData.User || !formData.Password || !formData.CustomerID || !formData.roleID) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    await fetchCSRFToken();
    const csrfToken = Cookies.get('csrftoken')
    
    const endpoint = isEditMode ? 'adminEditUser' : 'adminCreateUser';
    const method = isEditMode ? 'PUT' : 'POST';
    (async () => {
      try {
        const response = await fetchWithAuth(
          `${apiUrl}api/${endpoint}/`,
          {
            method,
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
              Authorization: `Bearer ${localStorage.getItem('session_token')}`,
            },
            credentials: 'include',
            body: JSON.stringify(formData)
          }
        );
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")){
          const data = await response.json();
          if (response.ok) {
            alert(isEditMode ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
            onSave(formData, isEditMode);
            onClose();
          } else {
            alert(data.message || 'Error al guardar el usuario');
          }
        } else {
          const text = await response.text();
          console.error('Unexpected response format:', text);
          alert('Error inesperado del servidor. Por favor, inténtelo de nuevo.');
        }
      } catch (error) {
        console.error(error); // Prints the error object
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
              <label htmlFor="userID">ID de Usuario:</label>
              <input
                type="text"
                id="userID"
                name="userID"
                value={formData.userID}
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
            <label htmlFor="CustomerID">Cliente asociado:</label>
            <select
              id="CustomerID"
              name="CustomerID"
              value={formData.CustomerID}
              onChange={handleChange}
            >
              <option value="">Seleccione un cliente</option>
              {customers.map(customer => (
                <option key={customer.ID} value={customer.ID}>{customer.FullName}</option>
              ))}
            </select>
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