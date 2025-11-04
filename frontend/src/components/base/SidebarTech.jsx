import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/base/menu.css';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import logo from '../../assets/IMG/Gipsy_imagotipo_medioBlanco.png'

const SidebarTech = ({ activePage, sidebarActive, closeSidebar, onLogout }) => {
  const isActive = (page) => activePage === page;

  const {user_id, user_first_name, email_address, role} = getCurrentUserInfo();
  const isAdmin = role === 'Administrador';

  // Ensure mobile viewport CSS variable is set early so sidebar layout
  // calculations using var(--vh) don't end up with incorrect heights on
  // first paint (common on some mobile browsers). Also refresh on resize
  // and orientation change.
  useEffect(() => {
    const setVh = () => {
      if (typeof window !== 'undefined' && window.innerHeight) {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      }
    };

    setVh();
    const timer = setTimeout(setVh, 250);
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`} id="sidebarTech">
        <div className="logo">
            <Link to="/technical-service/home" onClick={closeSidebar}>
              <img src={logo} alt="Logo" />
            </Link>
        </div>
        <div className="containerSideBar">
          <ul>
            <li>
              <div className={`optionContainer ${isActive('home') ? 'active' : ''}`}>
                <Link to="/technical-service/home" className="optionLink" onClick={closeSidebar}>Inicio</Link>
              </div>
            </li>
            <li>
              <div className={`optionContainer ${isActive('warrantiesList') ? 'active' : ''}`}>
                <Link to="/technical-service/history-warranties" className="optionLink" onClick={closeSidebar}>Historial de Servicios</Link>
              </div>
            </li>
          </ul>
          <ul className="bottomMenu">
            {isAdmin && (
              <>
                <li>
                  <div className={`optionContainer ${isActive('home') ? '' : ''}`}>
                    <Link to="/user/home" className="optionLink" onClick={closeSidebar}>Ir a Portal de Usuario</Link>
                  </div>
                </li>
                <li>
                  <div className={`optionContainer ${isActive('home') ? '' : ''}`}>
                    <Link to="/admin/home" className="optionLink" onClick={closeSidebar}>Ir a Portal de Administrador</Link>
                  </div>
                </li>
              </>
            )}
            {/* Opción Cerrar Sesión */}
            <li>
              <div className={`optionContainer ${isActive('login') ? 'active' : ''}`}>
                <Link to="/" className="optionLink" onClick={onLogout}>Cerrar Sesión</Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SidebarTech;