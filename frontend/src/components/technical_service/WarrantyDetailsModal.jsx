import React, { useState, useEffect } from 'react';
import '../../styles/technical_service/warrantyDetailsModal.css';

const WarrantyDetailsModal = ({ isOpen, onClose, warranty, onUpdateWarranty }) => {
  // Estado local para los campos editables del modal
  const [currentStatus, setCurrentStatus] = useState('');
  const [currentDiagnosis, setCurrentDiagnosis] = useState('');
  const [actionDescription, setActionDescription] = useState('');

  // Opciones de diagnóstico (puedes cargarlas de una API en un caso real)
  const diagnosisOptions = [
    'Sin errores',
    'Falla de encendido',
    'Problema de batería',
    'Defecto de pantalla',
    'Falla de conexión',
    'Otro (especificar en descripción)'
  ];

  // Actualiza los estados internos del modal cuando la prop 'warranty' cambie
  useEffect(() => {
    if (warranty) {
      setCurrentStatus(warranty.estado);
      // Puedes inicializar diagnosis y description si tus datos de garantía los tienen,
      // de lo contrario, comienzan vacíos o con valores por defecto.
      setCurrentDiagnosis(''); // O warranty.diagnostico si existiera
      setActionDescription(''); // O warranty.descripcionAccion si existiera
    }
  }, [warranty]);

  if (!isOpen || !warranty) return null; // No renderiza nada si el modal no está abierto o no hay garantía

  const handleStatusChange = (e) => setCurrentStatus(e.target.value);
  const handleDiagnosisChange = (e) => setCurrentDiagnosis(e.target.value);
  const handleActionDescriptionChange = (e) => setActionDescription(e.target.value);

  const handleCloseCase = () => {
    // Aquí puedes realizar la lógica para "cerrar" el caso.
    // En una aplicación real, esto implicaría una llamada a la API.
    const updatedWarranty = {
      ...warranty,
      estado: 'Cerrado', // Forzamos el estado a 'Cerrado' al cerrar el caso
      diagnostico: currentDiagnosis,
      descripcionAccion: actionDescription,
      fechaCierre: new Date().toISOString().split('T')[0], // Añade la fecha de cierre
    };
    onUpdateWarranty(updatedWarranty); // Llama a la función prop para actualizar en la lista principal
    onClose(); // Cierra el modal
    alert('Caso cerrado exitosamente para la garantía: ' + warranty.codigo);
    console.log('Caso Cerrado:', updatedWarranty);
  };

  const handleUpdateCase = () => {
    // Lógica para actualizar el caso sin cerrarlo
    const updatedWarranty = {
      ...warranty,
      estado: currentStatus,
      diagnostico: currentDiagnosis,
      descripcionAccion: actionDescription,
    };
    onUpdateWarranty(updatedWarranty);
    onClose();
    alert('Caso actualizado para la garantía: ' + warranty.codigo);
    console.log('Caso Actualizado:', updatedWarranty);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Detalles de Garantía: {warranty.codigo}</h3>
          <button className="close-button" onClick={onClose}>&times;</button> {/* Botón de cerrar */}
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <strong>Código de Garantía:</strong> <span>{warranty.codigo}</span>
          </div>
          <div className="detail-row">
            <strong>Cliente:</strong> <span>{warranty.nombreCliente}</span>
          </div>
          <div className="detail-row">
            <strong>Tienda:</strong> <span>{warranty.tienda}</span>
          </div>
          <div className="detail-row">
            <strong>Fecha de Recepción:</strong> <span>{warranty.fechaRecepcion}</span>
          </div>
          <div className="detail-row">
            <strong>Fecha de Revisión:</strong> <span>{warranty.fechaRevision || 'N/A'}</span> {/* Asume que puedes tener una fecha de revisión */}
          </div>
          {warranty.fechaCierre && ( // Muestra fecha de cierre si existe
             <div className="detail-row">
                <strong>Fecha de Cierre:</strong> <span>{warranty.fechaCierre}</span>
            </div>
          )}
         <div className="detail-row">
            <strong>Producto:</strong> <span>{warranty.producto}</span>
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
              disabled={warranty.estado === 'Cerrado' || warranty.estado === 'Finalizado'} // No editar si ya está cerrado/finalizado
            >
              <option value="Abierto">Abierto</option>
              <option value="En Revisión">En Revisión</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="diagnosis-select">Diagnóstico:</label>
            <select
              id="diagnosis-select"
              value={currentDiagnosis}
              onChange={handleDiagnosisChange}
              className="modal-select"
              disabled={warranty.estado === 'Cerrado' || warranty.estado === 'Finalizado'}
            >
              <option value="">Seleccione un diagnóstico</option>
              {diagnosisOptions.map(option => (
                <option key={option} value={option}>{option}</option>
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
              disabled={warranty.estado === 'Cerrado' || warranty.estado === 'Finalizado'}
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
          {warranty.estado !== 'Cerrado' && warranty.estado !== 'Finalizado' ? (
            <>
              <button className="modal-button update-button" onClick={handleUpdateCase}>Actualizar Caso</button>
              <button className="modal-button close-case-button" onClick={handleCloseCase}>Cerrar Caso</button>
            </>
          ) : (
            <span className="case-closed-message">Este caso ya está {warranty.estado.toLowerCase()}.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarrantyDetailsModal;