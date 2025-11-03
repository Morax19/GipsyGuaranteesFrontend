import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import '../../styles/technical_service/warrantyDetailsModal.css';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

const WarrantyDetailsModal = ({ isOpen, onClose, warranty, onUpdateWarranty }) => {  
  // Estado local para los campos editables del modal
  const {user_id, user_first_name, email_address, role} = getCurrentUserInfo();
  const [currentStatus, setCurrentStatus] = useState('');
  const [currentDiagnosis, setCurrentDiagnosis] = useState('');
  const [actionDescription, setActionDescription] = useState('');
  const [statusOptions, setStatusOptions] = useState([]);
  const [diagnosisOptions, setDiagnosisOptions] = useState([]);
  const [requiredChangeBox, setRequiredChangeBox] = useState(false);
  const [loading, setLoading] = useState(false);

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
          //alert(data.warning)
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
  const handleCheckboxChange = (e) => setRequiredChangeBox(e.target.checked);

  const handleCloseCase = async () => {
    setLoading(true);

    // Validaciones previas: status, diagnosis, action description y archivo (imagen/PDF)
    if (!currentStatus || currentStatus.trim() === '') {
      alert('El estado del caso es obligatorio para cerrar el caso.');
      setLoading(false);
      return;
    }
    if (!currentDiagnosis || currentDiagnosis.trim() === '') {
      alert('La falla (diagnóstico) es obligatoria para cerrar el caso.');
      setLoading(false);
      return;
    }
    if (!actionDescription || actionDescription.trim() === '') {
      alert('La descripción del diagnóstico/acción es obligatoria para cerrar el caso.');
      setLoading(false);
      return;
    }

    const imgInput = document.getElementById('diagnosticIMG');
    const img = imgInput && imgInput.files && imgInput.files[0];
    if (!img) {
      alert('Por favor, adjunte una imagen o PDF del producto antes de cerrar el caso.');
      setLoading(false);
      return;
    }

    const selectedStatus = statusOptions.find(opt => opt.statusDescription === currentStatus);
    const selectedDiagnosis = diagnosisOptions.find(opt => opt.IssueDescription === currentDiagnosis);

    // Validar que se encontraron los objetos seleccionados (si se espera id en backend)
    if (!selectedStatus) {
      alert('El estado seleccionado no es válido. Por favor seleccione un estado existente.');
      setLoading(false);
      return;
    }
    if (!selectedDiagnosis) {
      alert('La falla seleccionada no es válida. Por favor seleccione una falla existente.');
      setLoading(false);
      return;
    }

    const technicalServiceCaseData = new FormData();
    technicalServiceCaseData.append('CaseNumber', warranty.CaseNumber);
    technicalServiceCaseData.append('statusID', selectedStatus.statusID);
    technicalServiceCaseData.append('issueID', selectedDiagnosis.IssueId);
    technicalServiceCaseData.append('issueResolutionDetails', actionDescription);
    technicalServiceCaseData.append('diagnosticIMG', img);
    technicalServiceCaseData.append('requiredChange', requiredChangeBox);

    technicalServiceCaseData.append('Customer', warranty.Customer);
    technicalServiceCaseData.append('WarrantyID', warranty.warrantyID);
    technicalServiceCaseData.append('TechnicalServiceEmail', email_address);
    technicalServiceCaseData.append('CustomerEmail', warranty.EmailAddress);
    technicalServiceCaseData.append('StoreName', warranty.companyName);
    technicalServiceCaseData.append('ProductName', warranty.Description);
    technicalServiceCaseData.append('ReceptionDate', warranty.receptionDate);
    technicalServiceCaseData.append('statusDescription', currentStatus);
    technicalServiceCaseData.append('issueDescription', currentDiagnosis);

    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/technicalServiceCloseCase/`,
        {
          method: 'POST',
          body: technicalServiceCaseData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Update local state only if backend update succeeded
        const updatedWarranty = {
          ...warranty,
          statusDescription: 'Cerrado',
          issueDescription: currentDiagnosis,
          issueResolutionDetails: actionDescription,
          closedDate: new Date().toISOString().split('T')[0],
        };
        onUpdateWarranty(updatedWarranty);
        setLoading(false);
        onClose();
        alert('Caso cerrado exitosamente para la garantía: ' + warranty.warrantyID);
        console.log('Caso Cerrado:', updatedWarranty);
      } else {
        alert(data.warning || 'No se pudo cerrar el caso.');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      alert('Error de conexión con el servidor');
      console.log(`Error de conexión con el servidor: ${error}`);
    }
  };

  const handleUpdateCase = async () => {
    setLoading(true);

    // Validaciones previas: status, diagnosis, action description
    if (!currentStatus || currentStatus.trim() === '') {
      alert('El estado del caso es obligatorio para actualizar el caso.');
      setLoading(false);
      return;
    }
    if (!currentDiagnosis || currentDiagnosis.trim() === '') {
      alert('La falla (diagnóstico) es obligatoria para actualizar el caso.');
      setLoading(false);
      return;
    }
    if (!actionDescription || actionDescription.trim() === '') {
      alert('La descripción del diagnóstico/acción es obligatoria para actualizar el caso.');
      setLoading(false);
      return;
    }

    // Find the selected status and diagnosis objects
    const selectedStatus = statusOptions.find(opt => opt.statusDescription === currentStatus);
    const selectedDiagnosis = diagnosisOptions.find(opt => opt.IssueDescription === currentDiagnosis);
    const imgInput = document.getElementById('diagnosticIMG');
    const img = imgInput && imgInput.files && imgInput.files[0];

    // Validate selection objects
    if (!selectedStatus) {
      alert('El estado seleccionado no es válido. Por favor seleccione un estado existente.');
      setLoading(false);
      return;
    }
    if (!selectedDiagnosis) {
      alert('La falla seleccionada no es válida. Por favor seleccione una falla existente.');
      setLoading(false);
      return;
    }

    // Validación de imagen: usar mismo mensaje que en handleCloseCase
    if (!img) {
      alert('Por favor, adjunte una imagen o PDF del producto antes de actualizar el caso.');
      setLoading(false);
      return;
    }

    const technicalServiceCaseData = new FormData();
    technicalServiceCaseData.append('CaseNumber', warranty.CaseNumber);
    technicalServiceCaseData.append('statusID', selectedStatus.statusID);
    technicalServiceCaseData.append('issueID', selectedDiagnosis.IssueId);
    technicalServiceCaseData.append('issueResolutionDetails', actionDescription);
    technicalServiceCaseData.append('diagnosticIMG', img);
    
    technicalServiceCaseData.append('Customer', warranty.Customer);
    technicalServiceCaseData.append('WarrantyID', warranty.warrantyID);
    technicalServiceCaseData.append('TechnicalServiceEmail', email_address);
    technicalServiceCaseData.append('CustomerEmail', warranty.EmailAddress);
    technicalServiceCaseData.append('StoreName', warranty.companyName);
    technicalServiceCaseData.append('ProductName', warranty.Description);
    technicalServiceCaseData.append('ReceptionDate', warranty.receptionDate);
    technicalServiceCaseData.append('statusDescription', currentStatus);
    technicalServiceCaseData.append('issueDescription', currentDiagnosis);

    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/technicalServiceUpdateCase/`,
        {
          method: 'POST',
          body: technicalServiceCaseData,
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
        setLoading(false);
        onClose();
        alert('Caso actualizado para la garantía: ' + warranty.warrantyID);
        console.log('Caso Actualizado:', updatedWarranty);
      } else {
        console.log(data.error);
        alert(data.warning || 'No se pudo actualizar el caso.');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert(`Error de conexión con el servidor ${error}`);
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

          {/* Sección de 'Datos del Cliente' */}

          <div className="section-container">
            <h4 className="section-title">Datos del Cliente</h4>
            <div className="detail-row">
              <strong>Cliente:</strong> <span>{warranty.Customer}</span>
            </div>
            <div className="detail-row">
              <strong>C.I.:</strong> <span>{warranty.NationalId}</span>
            </div>
            <div className="detail-row">
              <strong>Teléfono:</strong> <span>{warranty.PhoneNumber}</span>
            </div>
            <div className="detail-row">
              <strong>Correo:</strong> <span>{warranty.EmailAddress}</span>
            </div>
          </div>
          <hr className="section-divider" />

          {/* Sección de 'Datos del Producto y Garantía' */}

          <div className="section-container">
            <h4 className="section-title">Datos del Producto y Garantía</h4>
            <div className="detail-row">
              <strong>Código del caso:</strong> <span>{warranty.CaseNumber}</span>
            </div>
            <div className="detail-row">
              <strong>Tienda:</strong> <span>{warranty.companyName}</span>
            </div>
            <div className="detail-row">
              <strong>Fecha de Recepción:</strong> <span>{warranty.receptionDate}</span>
            </div>
            <div className="detail-row">
              <strong>Fecha de Revisión:</strong> <span>{warranty.lastUpdated || 'N/A'}</span> {/* Asume que puedes tener una fecha de revisión */}
            </div>
            {warranty.fechaCierre && ( // Muestra fecha de cierre si existe
              <div className="detail-row">
                  <strong>Fecha de Cierre:</strong> <span>{warranty.fechaCierre}</span>
              </div>
            )}
            <div className="detail-row">
              <strong>Marca:</strong> <span>{warranty.Brand}</span>
            </div>
            <div className="detail-row">
              <strong>BinLocation:</strong> <span>{warranty.BinLocation}</span>
            </div>
            <div className="detail-row">
              <strong>Producto:</strong> <span>{warranty.Description}</span>
            </div>
          </div>

          <hr /> {/* Separador visual */}

          <h4>Gestión del Caso</h4>

          <div className="form-group">
            <label htmlFor="status-select">
              Estado del Caso <span className="required-asterisk">*</span>
            </label>
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
            <label htmlFor="diagnosis-select">
              Falla <span className="required-asterisk">*</span>
            </label>
            <select
              id="diagnosis-select"
              value={currentDiagnosis}
              onChange={handleDiagnosisChange}
              className="modal-select"
              disabled={warranty.statusDescription === 'Cerrado' || warranty.statusDescription === 'Finalizado'}
            >
              <option value="">Seleccione la falla del producto</option>
              {diagnosisOptions.map(option => (
                <option key={option.IssueId} value={option.IssueDescription}>{option.IssueDescription}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="diagnosticIMG">
              Imagen del Producto <span className="required-asterisk">*</span>
            </label>
            <input
              type="file"
              id="diagnosticIMG"
              name="diagnosticIMG"
              accept="image/*, .pdf"
              required
            />
            <small style={{ display: 'block', marginBottom: '12px', color: '#555' }}>
              Solo se aceptan archivos JPG, PNG, PDF
            </small>

          </div>

          <div className="form-group">
            <label htmlFor="action-description">
              Diagnóstico <span className="required-asterisk">*</span>
            </label>
            <textarea
              id="action-description"
              value={actionDescription}
              onChange={handleActionDescriptionChange}
              className="modal-textarea"
              placeholder="Describa el diagnóstico del producto..."
              rows="4"
              disabled={warranty.statusDescription === 'Cerrado' || warranty.statusDescription === 'Finalizado'}
            ></textarea>
          </div>
        </div>

        {warranty.statusDescription !== 'Cerrado' && currentStatus === 'Cerrado' && (
          <div className="form-group">
            <label htmlFor="required-change">
              Indique si el producto requiere cambio:
              <input type="checkbox" checked={requiredChangeBox} onChange={handleCheckboxChange}/>
            </label>
        </div>
        )}

        <div className="modal-footer">
          {warranty.s !== 'Cerrado' && warranty.statusDescription !== 'Finalizado' ? (
            <>
              {currentStatus !== 'Cerrado' && (
                <button className="modal-button update-button" disabled={loading} onClick={handleUpdateCase}>
                  {loading ? 'Actualizando...' : 'Actualizar Caso'}
                </button>
              )}
              
              {warranty.statusDescription !== 'Cerrado' && currentStatus === 'Cerrado' && (
                <button className="modal-button close-case-button" disabled={loading} onClick={handleCloseCase}>
                  {loading ? 'Cerrando...' : 'Cerrar Caso'}
                </button>
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