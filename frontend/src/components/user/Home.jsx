import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import LayoutBase from '../base/LayoutBaseUser';
import imageHome from '../../assets/IMG/WarrantyWallpaperClientHome.webp';

const Home = () => {
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
  const pdfUrl = "/NORMATIVAS DE GARANTIA PRODUCTOS  ELECTRICOS GIPSY 09-10-2025.pdf"

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
        {/* <img
          src={imageHome}
          alt="Seller Wallpaper"
          className="user-home-img"
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
        /> */}
        {/* REEMPLAZA LA ETIQUETA <img ... /> POR ESTO: */}
        <div 
          style={{
            width: '100%',
            maxWidth: '1100px',
            margin: '32px auto',
            borderRadius: '18px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            aspectRatio: '16/9',
            position: 'relative'
          }}
        >
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/SavhHnWla6c"  /*https://www.youtube.com/embed/TU_ID_DEL_VIDEO*/
            title="Servicio de Garantías - Video Tutorial"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ display: 'block' }}
          ></iframe>
        </div>
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