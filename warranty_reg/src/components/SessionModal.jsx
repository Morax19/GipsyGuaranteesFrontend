import React from 'react';

export default function SessionModal({
  onRefresh,
  onLogout,
  onClose,
  isLoading = false
}) {
  return (
    <div className="session-modal-overlay">
      <div className="session-modal-box">
        <h3>Sesión a punto de expirar</h3>
        <p>¿Deseas extender tu sesión?</p>

        <div className="session-modal-actions">
          {/* Primary action */}
          <button
            className="session-modal-btn-primary"
            onClick={onRefresh}
            disabled={isLoading}
          >
            {isLoading ? 'Extendiéndo…' : 'Extender sesión'}
          </button>

          {/* Secondary action */}
          <button
            className="session-modal-btn-secondary"
            onClick={onLogout}
            disabled={isLoading}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}