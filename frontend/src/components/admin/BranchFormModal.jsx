import React, { useState, useEffect } from 'react';
import '../../styles/admin/userFormModal.css';

const BranchFormModal = ({ isOpen, onClose, branchToEdit, onSave }) => {
  const [formData, setFormData] = useState({
    branchID: '',
    customerID: '',
    isRetail: 0,
    RIFtype: '',
    RIF: '',
    companyName: '',
    address: '',
    branchDescription: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const RIFtypeOptions = ['V', 'E', 'J', 'G', 'C', 'P'];

  useEffect(() => {
    if (branchToEdit) {
      setFormData(branchToEdit);
      setIsEditMode(true);
    } else {
      setFormData({
        branchID: '',
        customerID: '',
        isRetail: 0,
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
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSave = () => {
    if (!formData.customerID || !formData.RIFtype || !formData.RIF || !formData.companyName || !formData.address) {
      alert('Por favor, complete todos los campos obligatorios (ID de Cliente, Tipo RIF, RIF, Nombre de Compañía, Dirección).');
      return;
    }
    onSave(formData, isEditMode);
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
            <label htmlFor="customerID">ID de Cliente:</label>
            <input
              type="number"
              id="customerID"
              name="customerID"
              value={formData.customerID}
              onChange={handleChange}
              placeholder="Ingrese el ID del cliente"
            />
          </div>

          <div className="form-group-user checkbox-group-user">
            <label htmlFor="isRetail">Es Minorista:</label>
            <input
              type="checkbox"
              id="isRetail"
              name="isRetail"
              checked={formData.isRetail === 1}
              onChange={handleChange}
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
              type="number"
              id="RIF"
              name="RIF"
              value={formData.RIF}
              onChange={handleChange}
              placeholder="Ingrese el número de RIF"
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="companyName">Nombre de Compañía:</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Ingrese el nombre de la compañía"
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