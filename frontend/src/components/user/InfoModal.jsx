import React from 'react';
import '../../styles/user/infoModal.css';

const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="infoModal-overlay-info">
      <div className="infoModal-content-info">
        <div className="infoModal-header-info">
          <h3>Información Importante</h3>
          <button className="close-button-info" onClick={onClose}>&times;</button>
        </div>

        <div className="infoModal-body-info">
          <p>
            El registro de garantía se realiza <strong>por producto</strong>.
          </p>
          <p>
            Si la factura contiene varios productos, debe crear un registro de garantía por cada uno de ellos.
          </p>
        </div>

        <div className="infoModal-footer-info">
          <button className="infoModal-button-info confirm-button-info" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;