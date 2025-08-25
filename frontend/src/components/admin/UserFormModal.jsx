import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;
import '../../styles/admin/userFormModal.css';
import eye from '../../assets/IMG/ojo.png';

const UserFormModal = ({ isOpen, onClose, userToEdit, onSave, roles, onReload }) => {
  const [formData, setFormData] = useState({
    userID: '',
    FirstName: '',
    LastName: '',
    EmailAddress: '',
    PhoneNumber: '',
    Address: '',
    Zip: '',
    Password: '',
    CustomerID: '',
    roleID: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setIsEditMode(true);
      setFormData(prevData => ({
        ...prevData,
        userID: userToEdit.userID,
        roleID: userToEdit.roleID,
        Password: userToEdit.Password,
    }));

      if(userToEdit.CustomerID){
        async function fetchCustomerDetail(){
          try{
            const response = await fetchWithAuth(
              `${apiUrl}/api/adminGetCustomerByID/?customerID=${userToEdit.CustomerID}`,
              {
                method: 'GET',
              }
            );
            const customerData = await response.json();

            if (response.ok){
              setFormData(prevData => ({
                ...prevData,
                FirstName: customerData.FirstName,
                LastName: customerData.LastName,
                EmailAddress: customerData.EmailAddress,
                PhoneNumber: customerData.PhoneNumber || '',
                Address: customerData.Address || '',
                Zip: customerData.Zip || '',
              }));
            } else {
              console.error(customerData.message || 'Error fetching customer details');
            }
          } catch (error) {
            console.error('Error connecting to the server', error);
          }
        }
        fetchCustomerDetail();
        
      }
    } else {
      setFormData({
        userID: '',
        FirstName: '',
        LastName: '',
        EmailAddress: '',
        PhoneNumber: '',
        Address: '',
        Zip: '',
        Password: '',
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
    if (!formData.FirstName || !formData.LastName || !formData.EmailAddress || !formData.Password || !formData.roleID) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }
    
    const endpoint = isEditMode ? 'adminEditUsers' : 'adminCreateUsers';
    const method = isEditMode ? 'PUT' : 'POST';
    (async () => {
      try {
        const response = await fetchWithAuth(
          `${apiUrl}/api/${endpoint}/`,
          {
            method,
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
            onReload();
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
            <label htmlFor="FirstName">Nombre:</label>
            <input
              type="text"
              id="FirstName"
              name="FirstName"
              required
              value={formData.FirstName}
              onChange={handleChange}
              placeholder="Ingrese el nombre del usuario"
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="LastName">Apellido:</label>
            <input
              type="text"
              id="LastName"
              name="LastName"
              required
              value={formData.LastName}
              onChange={handleChange}
              placeholder="Ingrese el apellido del usuario"
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="EmailAddress">Correo electrónico:</label>
            <input
              type="email"
              id="EmailAddress"
              name="EmailAddress"
              required
              value={formData.EmailAddress}
              onChange={handleChange}
              placeholder="Ingrese el correo electrónico del usuario"
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="PhoneNumber">Teléfono:</label>
            <input
              type="tel"
              id="PhoneNumber"
              name="PhoneNumber"
              value={formData.PhoneNumber}
              onChange={handleChange}
              placeholder="Ingrese el teléfono del usuario (Opcional)"
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="Address">Dirección:</label>
            <input
              type="text"
              id="Address"
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              placeholder="Ingrese la dirección del usuario (Opcional)"
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="Zip">Código Postal:</label>
            <input
              type="text"
              id="Zip"
              name="Zip"
              value={formData.Zip}
              onChange={handleChange}
              placeholder="Ingrese el código postal del usuario (Opcional)"
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
            <label htmlFor="roleID">Rol:</label>
            <select
              id="roleID"
              name="roleID"
              value={formData.roleID}
              onChange={handleChange}
            >
              <option value="">Seleccione un rol</option>
              {roles.map(role => (
                <option key={role.RoleID} value={role.RoleID}>{role.Description}</option>
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