import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import '../../styles/admin/userFormModal.css';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

const FailsFormModal = ({ isOpen, onClose, onSave }) => {
  const [issueDescription, setIssueDescription] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setIssueDescription('');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setIssueDescription(e.target.value);
  };

  const handleSave = async () => {
    if (!issueDescription) {
      alert('La descripción de la falla no puede estar vacía.');
      return;
    }

    const submitData = {
      IssueDescription: issueDescription
    };

    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/technicalServiceCreateIssue/`,
        {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(submitData)
        }
      );

      if (response.ok) {
        alert('Falla creada correctamente.');
        onSave();
        onClose();
      } else {
        const data = await response.json();
        alert(data.warning || 'Error al crear la falla.');
      }
    } catch (error) {
      console.error('Error de conexión con el servidor:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-user">
      <div className="modal-content-user">
        <div className="modal-header-user">
          <h3>Agregar Nueva Falla</h3>
          <button className="close-button-user" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body-user">
          <div className="form-group-user">
            <label htmlFor="issueDescription">
              Descripción de la Falla <span className="required-asterisk">*</span>
            </label>
            <textarea
              id="issueDescription"
              name="issueDescription"
              required
              value={issueDescription}
              onChange={handleChange}
              placeholder="Ej: La pantalla no enciende, La batería no carga, etc."
              rows="4"
            />
            <small style={{ display: 'block', marginBottom: '12px', color: '#555' }}>
              La falla registrada debe indicar una falla general. Los detalles específicos de los productos llevados a Servicio Técnico deben ser indicados en el Diagnóstico del Servicio.
            </small>
          </div>
        </div>

        <div className="modal-footer-user">
          <button className="modal-button-user cancel-button-user" onClick={onClose}>
            Cancelar
          </button>
          <button className="modal-button-user save-button-user" onClick={handleSave}>
            Agregar Falla
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailsFormModal;