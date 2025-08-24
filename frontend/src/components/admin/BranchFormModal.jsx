import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../fetchWithAuth';
import '../../styles/admin/userFormModal.css';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

const BranchFormModal = ({ isOpen, onClose, branchToEdit, onSave }) => {
  const [formData, setFormData] = useState({
    branchID: '',
    customerID: '',
    isRetail: '',
    RIFtype: '',
    RIF: '',
    companyName: '',
    address: '',
    branchDescription: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [mainCustomers, setMainCustomers] = useState([]);
  const RIFtypeOptions = ['V', 'E', 'J', 'G', 'C', 'P'];

  useEffect(() => {
    async function fetchMainCustomers() {
      try {
        const response = await fetchWithAuth(
          `${apiUrl}/api/adminGetMainCustomers/`,
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
          setMainCustomers(data);
        } else {
          console.error(data.message || 'Error fetching MainCustomers');
        }
      } catch {
        console.error('Error connecting to server');
      }
    }
    fetchMainCustomers();
  }, []);

  useEffect(() => {
    if (branchToEdit) {
      // Format the data to match the select value string
      setFormData({
        ...branchToEdit,
        customerID: `${branchToEdit.customerID}-${branchToEdit.isRetail}`,
        isRetail: `${branchToEdit.isRetail}`
      });
      setIsEditMode(true);
    } else {
      setFormData({
        branchID: '',
        customerID: '',
        isRetail: '',
        RIFtype: '',
        RIF: '',
        companyName: '',
        address: '',
        branchDescription: '',
      });
      setIsEditMode(false);
    }
  }, [branchToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'customerID') {
        const [id, retail] = value.split('-');
        setFormData(prevData => ({
            ...prevData,
            customerID: value, 
            isRetail: retail,
        }));
    } else {
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? (checked ? '1' : '0') : value
        }));
    }
  };

  const handleSave = () => {
    if (!formData.customerID || !formData.RIFtype || !formData.RIF || !formData.companyName || !formData.address) {
      alert('Por favor, complete todos los campos obligatorios (ID de Cliente, Tipo RIF, RIF, Nombre de Compañía, Dirección).');
      return;
    }

    // Convert string values back to numbers for the API call
    const [customerID, isRetail] = formData.customerID.split('-');
    
    const dataToSend = {
      ...formData,
      customerID: parseInt(customerID),
      isRetail: parseInt(isRetail), // Correctly include and parse isRetail
    };

    const endpoint = isEditMode ? 'adminEditBranch' : 'adminCreateBranch';
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
            body: JSON.stringify(dataToSend)
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert(isEditMode ? 'Sucursal actualizada correctamente.' : 'Sucursal creada correctamente.');
          onSave(data, isEditMode);
          onClose();
        } else {
          alert(data.message || 'Error al guardar la sucursal');
        }
      } catch {
        alert('Error de conexión con el servidor');
      }
    })();
  };

  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay-user">
      <div className="modal-content-user">
        <div className="modal-header-user">
          <h3>{isEditMode ? 'Editar Sucursal' : 'Agregar Sucursal'}</h3>
          <button className="close-button-user" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body-user">
          {isEditMode && (
            <div className="form-group-user">
              <label htmlFor="branchID">ID de Sucursal:</label>
              <input
                type="text"
                id="branchID"
                name="branchID"
                value={formData.branchID}
                disabled
              />
            </div>
          )}
          
          <div className="form-group-user">
            <label htmlFor="customerID">Compañía asociada:</label>
            <select
              id="customerID"
              name="customerID"
              value={formData.customerID}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Seleccione una compañía</option>
              {mainCustomers.map(mainCustomer => (
                <option 
                  key={`${mainCustomer.ID}-${mainCustomer.isRetail}`} 
                  value={`${mainCustomer.ID}-${mainCustomer.isRetail}`}
                >
                  {`${mainCustomer.ID}-${mainCustomer.FullName}`}
                </option>
              ))}
            </select>
          </div>
          
          {/* Note: the checkbox is now automatically handled by the select change */}
          <div className="form-group-user checkbox-group-user">
            <label htmlFor="isRetail">Es Minorista:</label>
            <input
              type="checkbox"
              id="isRetail"
              name="isRetail"
              checked={formData.isRetail === '1'}
              onChange={handleChange}
              disabled={true} // Disable since it's now driven by the select
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="RIFtype">Tipo RIF:</label>
            <select
              id="RIFtype"
              name="RIFtype"
              value={formData.RIFtype}
              onChange={handleChange}
            >
              <option value="">Seleccione un tipo</option>
              {RIFtypeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-group-user">
            <label htmlFor="RIF">RIF:</label>
            <input
              type="text"
              id="RIF"
              name="RIF"
              value={formData.RIF}
              onChange={handleChange}
              placeholder="Ingrese el número de RIF"
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="companyName">Nombre de la sucursal:</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Ingrese el nombre de la sucursal"
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="address">Dirección:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ingrese la dirección de la sucursal"
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="branchDescription">Descripción de Sucursal:</label>
            <textarea
              id="branchDescription"
              name="branchDescription"
              value={formData.branchDescription}
              onChange={handleChange}
              placeholder="Ingrese una descripción"
              rows="3"
            />
          </div>
        </div>

        <div className="modal-footer-user">
          <button className="modal-button-user cancel-button-user" onClick={onClose}>Cancelar</button>
          <button className="modal-button-user save-button-user" onClick={handleSave}>
            {isEditMode ? 'Guardar Cambios' : 'Agregar Sucursal'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchFormModal;