import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import '../../styles/admin/userFormModal.css';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

const FailsFormModal = ({ isOpen, onClose, onSave, issueToEdit }) => {
  const [issueDescription, setIssueDescription] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (issueToEdit) {
      setIsEditMode(true);
      setIssueDescription(issueToEdit.IssueDescription);
    } else {
      setIsEditMode(false);
      setIssueDescription('');
    }
  }, [issueToEdit]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    setIssueDescription(e.target.value);
  };

  const handleSave = async () => {
    setLoading(true);

    if (!issueDescription) {
      alert('La descripción de la falla no puede estar vacía.');
      setLoading(false);
      return;
    }

    const submitData = {
      IssueDescription: issueDescription
    };

    const endpoint = isEditMode ? 'technicalServiceEditIssue' : 'technicalServiceCreateIssue';
    const method = isEditMode ? 'PUT' : 'POST';
    
    // Si estamos editando, incluimos el IssueId en la data a enviar
    if (isEditMode) {
      submitData.IssueId = issueToEdit.IssueId;
    }

    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/${endpoint}/`,
        {
          method,
          credentials: 'include',
          body: JSON.stringify(submitData)
        }
      );

      if (response.ok) {
        alert(isEditMode ? 'Falla actualizada correctamente.' : 'Falla creada correctamente.');
        onSave(submitData, isEditMode); // Llama a la función onSave en el componente padre
        setLoading(false);
        onClose();
      } else {
        setLoading(false);
        const data = await response.json();
        alert(data.warning || 'Error al guardar la falla.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error de conexión con el servidor:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="modal-overlay-user">
      <div className="modal-content-user">
        <div className="modal-header-user">
          <h3>{isEditMode ? 'Editar Falla' : 'Agregar Nueva Falla'}</h3>
          <button className="close-button-user" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body-user">
          {isEditMode && (
             <div className="form-group-user">
              <label>ID de la Falla:</label>
              <input type="text" value={issueToEdit?.IssueId || ''} disabled />
            </div>
          )}
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
          <button className="modal-button-user save-button-user" disabled={loading} onClick={handleSave}>
            {isEditMode ? (loading ? 'Guardando...' : 'Guardar Cambios') : (loading ? 'Agregando...' : 'Agregar Falla')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailsFormModal;