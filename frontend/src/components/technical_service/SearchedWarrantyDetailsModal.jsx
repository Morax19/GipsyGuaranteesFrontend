import React from 'react';
import '../../styles/technical_service/warrantyDetailsModal.css';

const SearchedWarrantyDetailsModal = ({ isOpen, onClose, warranty, onOpenCase }) => {
  if (!isOpen || !warranty) return null;

  const isWarrantyValid = (purchaseDate, usedCount) => {
    const today = new Date();
    const pDate = new Date(purchaseDate);
    const validUntil = new Date(pDate.setFullYear(pDate.getFullYear() + 1));

    return today <= validUntil && usedCount < 2;
  };

  const usedCount = warranty.usedCount !== undefined ? warranty.usedCount : 0;
  const validityStatus = isWarrantyValid(warranty.purchaseDate, usedCount) ? 'Válida' : 'No Válida';
  const canOpenCase = warranty.TechnicalServiceStatus !== 'Cerrado' && usedCount < 2 && validityStatus === 'Válida';


  const handleOpenCaseClick = () => {
    onOpenCase(warranty);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Detalles de Garantía</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <strong>Código de Garantía:</strong> <span>{warranty.WarrantyNumber}</span>
          </div>
          <div className="detail-row">
            <strong>Fecha de Registro:</strong> <span>{warranty.purchaseDate || 'N/A'}</span> {/* Asumiendo 'purchaseDate' es la fecha de registro */}
          </div>
          <div className="detail-row">
            <strong>Número de Factura:</strong> <span>{warranty.invoiceNumber || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <strong>Producto:</strong> <span>{warranty.Brand} - {warranty.Model}</span>
          </div>
          <div className="detail-row">
            <strong>Estatus (Vigencia):</strong> 
            <span style={{ color: validityStatus === 'Válida' ? '#28a745' : '#d9534f', fontWeight: 'bold' }}>
              {validityStatus}
            </span>
          </div>
          <div className="detail-row">
            <strong>Veces Utilizada:</strong> 
            <span>{usedCount} / 2</span>
          </div>
          <div className="detail-row">
            <strong>Estado Actual del Caso:</strong> 
            <span className={`status-${warranty.estado ? warranty.estado.replace(/\s+/g, '-').toLowerCase() : 'desconocido'}`}>
                {warranty.estado || 'N/A'}
            </span>
          </div>

          <hr />

          <div className="modal-footer" style={{ justifyContent: 'center' }}>
            {canOpenCase ? (
              <button className="modal-button open-case-button" onClick={handleOpenCaseClick}>
                Abrir Caso
              </button>
            ) : (
              <span className="case-closed-message" style={{ textAlign: 'center' }}>
                No es posible abrir un caso para esta garantía.
                <br/> (Usos: {usedCount}/2, Vigencia: {validityStatus})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchedWarrantyDetailsModal;