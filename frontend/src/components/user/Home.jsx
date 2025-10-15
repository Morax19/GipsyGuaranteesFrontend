import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import { useNavigate } from 'react-router-dom';
import LayoutBase from '../base/LayoutBaseUser';
import imageHome from '../../assets/IMG/WarrantyWallpaperClientHome.webp';

const Home = () => {

  const navigate = useNavigate();

  // Initialize modal visibility from localStorage so acceptance persists across visits
  const [showModal, setShowModal] = useState(() => {
    try {
      // Use sessionStorage so acceptance lasts only for the browser tab/session
      const accepted = sessionStorage.getItem('accepted_terms');
      return accepted === 'true' ? false : true;
    } catch (e) {
      // If storage is unavailable, fall back to showing the modal 26660853
      return true;
    }
  });
  const acceptBtnRef = useRef(null);
  const pdfUrl = "/NormativasGarantias.pdf"

  // Keep the page from scrolling and focus the Accept button while modal is open
  useEffect(() => {
    if (showModal) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // wait one tick to ensure ref is mounted
      setTimeout(() => acceptBtnRef.current?.focus(), 0);
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
    // Ensure restoration if it closes
    document.body.style.overflow = '';
    return undefined;
  }, [showModal]);

  // Logout handling moved to LayoutBaseUser; Home no longer listens for logout events.
  
  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      alert('Por favor, inicie sesión para acceder a esta página.');
      navigate('/user/login');
      return null;
    }
  }, [navigate]);

  const {user_id, user_first_name, email_address, role} = getCurrentUserInfo();

  return (
    <LayoutBase activePage="home">
      <div className="content">
        <div className="title-container">
          <div className="title-center">
            <h2>Control de Garantías</h2>
          </div>
          <div className="title-center">
            <h3>Bienvenido(a), {user_first_name}</h3>
          </div>
        </div>
        <img
          src={imageHome}
          alt="Seller Wallpaper"
          style={{
            width: '100%',
            maxWidth: '1100px',
            display: 'block',
            margin: '32px auto',
            borderRadius: '18px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            border: '1px solid #e0e0e0',
            objectFit: 'cover'
          }}
        />
      </div>
      {/* Modal de Términos y Condiciones - aparece al entrar y sólo se cierra con Aceptar */}
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
                Al hacer clic en "Aceptar", usted confirma que ha leído, comprendido y acepta la totalidad de los Términos y Condiciones de las garantías descritos en este documento.
              </p>
              <button
                ref={acceptBtnRef}
                className="accept-button"
                onClick={() => {
                  try {
                    sessionStorage.setItem('accepted_terms', 'true');
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
    </LayoutBase>
  );
};

export default Home;