import React, { useEffect, useState, useRef } from 'react';
import '../../styles/base/welcome.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logoHome from '../../assets/IMG/Gipsy_imagotipo_color.png';

function WelcomePage() {
  const navigate = useNavigate();
  // Initialize modal visibility from localStorage so acceptance persists across visits
  const [showModal, setShowModal] = useState(() => {
    try {
      const accepted = localStorage.getItem('gipsy_accepted_terms');
      return accepted === 'true' ? false : true;
    } catch (e) {
      // If storage is unavailable, fall back to showing the modal 26660853
      return true;
    }
  });
  const acceptBtnRef = useRef(null);

  //const pdfUrl = 'https://gipsymx-my.sharepoint.com/:b:/g/personal/desarrollo_grupogipsy_com/EdoiV6RFGuZGt8ahISYXjEwBXP9VZ3oIOC3MW-FN-VbeTw?e=27yZ4f';
  //const pdfUrl = 'https://gipsymx-my.sharepoint.com/personal/desarrollo_grupogipsy_com/_layouts/15/download.aspx?UniqueId=a45722da-1a45-46e6-b7c6-a12126178c4c'
  const pdfUrl = "/NormativasGarantiasGipsy.pdf"

  useEffect(() => {
    // Cuando el modal está abierto, evitar scroll de fondo y poner foco en el botón Aceptar
    if (showModal) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // esperar al próximo tick para asegurar que el ref esté montado
      setTimeout(() => acceptBtnRef.current?.focus(), 0);
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
    // Asegurar restauración si se cierra
    document.body.style.overflow = '';
    return undefined;
  }, [showModal]);

  return (
    <div className="containerHome">
      {/* Curva inferior */}
      <svg
        className="wave-footer"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 150"
        preserveAspectRatio="none"
      >
        <path d="M 0 20 C 80 110 160 80 240 80 C 320 40 420 80 500 60 L 500 150 L 0 150 Z" fill="#619990" />
        <path d="M 0 60 C 150 160 330 -30 500 60 L 500 150 L 0 150 Z" fill="#a2c0bb" />
      </svg>
      {/* Logo Gipsy */}
      <img src={logoHome} alt="Logo" className="logoHome" />
      <h2>Bienvenido a Control de Garantías Gipsy</h2>

      {/* Link a Términos y Condiciones (también abre modal al entrar) */}
      <p>
        Conoce los
          <span>&nbsp;</span>
          <a
            href="https://gipsymx-my.sharepoint.com/:b:/g/personal/desarrollo_grupogipsy_com/EdoiV6RFGuZGt8ahISYXjEwBXBlRLGO8t_1fxi2-WhVIqw?e=cxHwpY"
            target="_blank"
            rel="noopener noreferrer"
            className="conditions-link"
          >
            Términos y Condiciones
          </a>
          <span>&nbsp;</span>
        de las garantías Gipsy.
      </p>

      {/* Botón para ingresar */}
      <input className="inputHome" type="submit" value="Ingresar" onClick={() => navigate('/user/login')}></input>
      <br /><br />

      {/* Link a Servicio Técnico */}
      <div className="welcome-footer">
        <Link to="/technical-service" className="service-link"> 
          Servicio Técnico
        </Link>
      </div>
      {/* Modal de Términos y Condiciones - aparece al ingresar y sólo se cierra con Aceptar */}
      {showModal && (
        <div className="terms-modal-overlay" role="dialog" aria-modal="true" aria-label="Términos y Condiciones">
          <div className="terms-modal-content">
            <h3>Términos y Condiciones</h3>
            <div className="terms-modal-body">
              <object data={pdfUrl} type="application/pdf" width="125%" height="100%">
                {/* Fallback a iframe si object no es compatible */}
                <iframe title="Términos y Condiciones" src={pdfUrl} width="100%" height="100%"></iframe>
              </object>
            </div>
            <div className="terms-modal-footer">
              <p className="acceptance-text">
                Al hacer clic en "Aceptar", usted confirma que ha leído, comprendido y acepta la totalidad de los Términos y Condiciones de las garantías Gipsy descritos en este documento.
              </p>
              <button
                ref={acceptBtnRef}
                className="accept-button"
                onClick={() => {
                  try {
                    localStorage.setItem('gipsy_accepted_terms', 'true');
                  } catch (e) {
                    // ignore storage errors
                  }
                  setShowModal(false);
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;