import React from 'react';
import '../../styles/technical_service/guaranteesDetailsModal.css';

const SearchedGuaranteeDetailsModal = ({ isOpen, onClose, guarantee, onOpenCase }) => {
  if (!isOpen || !guarantee) return null;

  const isGuaranteeValid = (purchaseDate, usedCount) => {
    const today = new Date();
    const pDate = new Date(purchaseDate);
    const validUntil = new Date(pDate.setFullYear(pDate.getFullYear() + 1));

    return today <= validUntil && usedCount < 2;
  };

  const validityStatus = isGuaranteeValid(guarantee.purchaseDate) ? 'Válida' : 'No Válida';
  const usedCount = guarantee.usedCount !== undefined ? guarantee.usedCount : 0;
  const canOpenCase = guarantee.estado !== 'Cerrado' && usedCount < 2 && validityStatus === 'Válida';


  const handleOpenCaseClick = () => {
    onOpenCase(guarantee);
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
            <strong>Código de Garantía:</strong> <span>{guarantee.codigo}</span>
          </div>
          <div className="detail-row">
            <strong>Fecha de Registro:</strong> <span>{guarantee.purchaseDate || 'N/A'}</span> {/* Asumiendo 'purchaseDate' es la fecha de registro */}
          </div>
          <div className="detail-row">
            <strong>Número de Factura:</strong> <span>{guarantee.invoiceNumber || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <strong>Producto:</strong> <span>{guarantee.MarcaProducto} - {guarantee.ModeloProducto}</span>
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
            <span className={`status-${guarantee.estado ? guarantee.estado.replace(/\s+/g, '-').toLowerCase() : 'desconocido'}`}>
                {guarantee.estado || 'N/A'}
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

export default SearchedGuaranteeDetailsModal;