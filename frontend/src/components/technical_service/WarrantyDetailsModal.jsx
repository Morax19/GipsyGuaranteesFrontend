import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import '../../styles/technical_service/warrantyDetailsModal.css';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

const WarrantyDetailsModal = ({ isOpen, onClose, warranty, onUpdateWarranty }) => {
  
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      alert('Por favor, inicie sesión para acceder a esta página.');
      navigate('/technical-service/login');
      return null;
    }
  }, [navigate]);  
  
  // Estado local para los campos editables del modal
  const [currentStatus, setCurrentStatus] = useState('');
  const [currentDiagnosis, setCurrentDiagnosis] = useState('');
  const [actionDescription, setActionDescription] = useState('');
  const [statusOptions, setStatusOptions] = useState([]);
  const [diagnosisOptions, setDiagnosisOptions] = useState([]);

  useEffect(() => {
    async function fetchAllStatuses() {
      try {
        const response = await fetchWithAuth(
          `${apiUrl}/api/technicalServiceGetStatus/`,
          {
            method: 'GET',
          }
        );
        const data = await response.json();
        if (response.ok) {
          setStatusOptions(data); // Save array of statuses
        } else {
          console.log(data.error);
          alert(data.warning)
        }
      } catch (error) {
        console.log('Error de conexión con el servidor');
        alert('Error de conexión con el servidor')
      }
    }

    async function fetchAllIssues() {
      try {
        const response = await fetchWithAuth(
          `${apiUrl}/api/technicalServiceGetIssue/`,
          {
            method: 'GET',
          }
        );
        const data = await response.json();
        if (response.ok) {
          setDiagnosisOptions(data);
        } else {

          console.log(data.error);
          alert(data.warning)
        }
      } catch (error) {
        console.log(`Error de conexión con el servidor: ${error}`);
        alert('Error de conexión con el servidor')
      }
    }

    fetchAllStatuses();
    fetchAllIssues();
  }, []);

  // Actualiza los estados internos del modal cuando la prop 'warranty' cambie
  useEffect(() => {
    if (warranty) {
      setCurrentStatus(warranty.statusDescription || '');
      setCurrentDiagnosis(warranty.issueDescription || ''); // O warranty.issueDescription si existiera
      setActionDescription(warranty.issueResolutionDetails || ''); 
    }
  }, [warranty]);

  if (!isOpen || !warranty) return null; // No renderiza nada si el modal no está abierto o no hay garantía

  const handleStatusChange = (e) => setCurrentStatus(e.target.value);
  const handleDiagnosisChange = (e) => setCurrentDiagnosis(e.target.value);
  const handleActionDescriptionChange = (e) => setActionDescription(e.target.value);

  const handleCloseCase = async () => {
    const selectedStatus = statusOptions.find(opt => opt.statusDescription === currentStatus);
    const selectedDiagnosis = diagnosisOptions.find(opt => opt.IssueDescription === currentDiagnosis);
 
    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/technicalServiceCloseCase/`, // Replace with your actual endpoint
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            CaseNumber: warranty.CaseNumber,
            statusID: selectedStatus,
            issueID: selectedDiagnosis.IssueId,
            issueResolutionDetails: actionDescription,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {

        const updatedWarranty = {
          ...warranty,
          statusID: selectedStatus,
          issueID: selectedDiagnosis,
          issueResolutionDetails: actionDescription,
          closedDate: new Date().toISOString().split('T')[0],
        };
        onUpdateWarranty(updatedWarranty);
        onClose();
        alert('Caso cerrado exitosamente para la garantía: ' + warranty.warrantyID);
        console.log('Caso Cerrado:', updatedWarranty);
      } else {
        alert(data.warning);
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
      console.log(`Error de conexión con el servidor: ${error}`);
    }
  };

  const handleUpdateCase = async () => {
    // Find the selected status and diagnosis objects
    const selectedStatus = statusOptions.find(opt => opt.statusDescription === currentStatus);
    const selectedDiagnosis = diagnosisOptions.find(opt => opt.IssueDescription === currentDiagnosis);

    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/technicalServiceUpdateCase/`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            CaseNumber: warranty.CaseNumber,
            statusID: selectedStatus ? selectedStatus.statusID : null,
            issueID: selectedDiagnosis ? selectedDiagnosis.IssueId : null,
            issueResolutionDetails: actionDescription,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Update local state only if backend update succeeded
        const updatedWarranty = {
          ...warranty,
          statusDescription: currentStatus,
          issueDescription: currentDiagnosis,
          issueResolutionDetails: actionDescription,
        };
        onUpdateWarranty(updatedWarranty);
        onClose();
        alert('Caso actualizado para la garantía: ' + warranty.warrantyID);
        console.log('Caso Actualizado:', updatedWarranty);
      } else {
        cosole.log(data.error)
        alert(data.warning);
      }
    } catch (error) {
      console.log(error);
      alert('Error de conexión con el servidor');
      
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Detalles de Garantía: {warranty.warrantyID}</h3>
          <button className="close-button" onClick={onClose}>&times;</button> {/* Botón de cerrar */}
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <strong>Código del caso:</strong> <span>{warranty.CaseNumber}</span>
          </div>
          <div className="detail-row">
            <strong>Cliente:</strong> <span>{warranty.Customer}</span>
          </div>
          <div className="detail-row">
            <strong>Tienda:</strong> <span>{warranty.companyName}</span>
          </div>
          <div className="detail-row">
            <strong>Fecha de Recepción:</strong> <span>{warranty.receptionDate}</span>
          </div>
          <div className="detail-row">
            <strong>Fecha de Revisión:</strong> <span>{warranty.lasUpdated || 'N/A'}</span> {/* Asume que puedes tener una fecha de revisión */}
          </div>
          {warranty.fechaCierre && ( // Muestra fecha de cierre si existe
             <div className="detail-row">
                <strong>Fecha de Cierre:</strong> <span>{warranty.fechaCierre}</span>
            </div>
          )}
         <div className="detail-row">
            <strong>Producto:</strong> <span>{warranty.Description}</span>
          </div>

          <hr /> {/* Separador visual */}

          <h4>Gestión del Caso</h4>

          <div className="form-group">
            <label htmlFor="status-select">Estado del Caso:</label>
            <select
              id="status-select"
              value={currentStatus}
              onChange={handleStatusChange}
              className="modal-select"
              disabled={warranty.statusDescription === 'Cerrado' || warranty.statusDescription === 'Finalizado'} // No editar si ya está cerrado/finalizado
            >
              <option value="">Seleccione un estado</option>
              {statusOptions.map(option => (
                <option key={option.statusID} value={option.statusDescription}>{option.statusDescription}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="diagnosis-select">Diagnóstico:</label>
            <select
              id="diagnosis-select"
              value={currentDiagnosis}
              onChange={handleDiagnosisChange}
              className="modal-select"
              disabled={warranty.statusDescription === 'Cerrado' || warranty.statusDescription === 'Finalizado'}
            >
              <option value="">Seleccione un diagnóstico</option>
              {diagnosisOptions.map(option => (
                <option key={option.IssueId} value={option.IssueDescription}>{option.IssueDescription}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="action-description">Descripción de la Acción Realizada:</label>
            <textarea
              id="action-description"
              value={actionDescription}
              onChange={handleActionDescriptionChange}
              className="modal-textarea"
              placeholder="Describa las acciones tomadas o el resultado de la revisión..."
              rows="4"
              disabled={warranty.statusDescription === 'Cerrado' || warranty.statusDescription === 'Finalizado'}
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
          {warranty.s !== 'Cerrado' && warranty.statusDescription !== 'Finalizado' ? (
            <>
              {currentStatus !== 'Cerrado' && (
                <button className="modal-button update-button" onClick={handleUpdateCase}>Actualizar Caso</button>
              )}
              
              {warranty.statusDescription !== 'Cerrado' && currentStatus === 'Cerrado' && (
                <button className="modal-button close-case-button" onClick={handleCloseCase}>Cerrar Caso</button>
              )}
            </>
          ) : (
            <span className="case-closed-message">Este caso ya está {warranty.statusDescription.toLowerCase()}.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarrantyDetailsModal;