import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/base/menu.css';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png'

const SidebarUser = ({ activePage, sidebarActive, closeSidebar, onLogout }) => {
  const isActive = (page) => activePage === page;

  const {user_id, user_first_name, email_address, role} = getCurrentUserInfo();
  const isAdmin = role === 'Administrador';

  // Ensure mobile viewport CSS variable is set as early as possible.
  // Some mobile browsers change the visual viewport after initial paint and
  // CSS relying on `var(--vh)` can compute incorrect heights causing items
  // to be clipped until a reload. Set the variable on mount and on resize
  // / orientationchange. Also schedule a short timeout to re-run after the
  // browser UI settles.
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
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`} id="sidebarUser">
        <div className="logo">
            <Link to="/user/home" onClick={closeSidebar}>
              <img src={logo} alt="Logo" />
            </Link>
        </div>
        <div className="containerSideBar">
          <ul>
            <li>
              <div className={`optionContainer ${isActive('home') ? 'active' : ''}`}>
                <Link to="/user/home" className="optionLink" onClick={closeSidebar}>Inicio</Link>
              </div>
            </li>
            <li>
              <div className={`optionContainer ${isActive('warranty') ? 'active' : ''}`}>
                <Link to="/user/warranty" className="optionLink" onClick={closeSidebar}>Registrar Garantía</Link>
              </div>
            </li>
            <li>
              <div className={`optionContainer ${isActive('history') ? 'active' : ''}`}>
                <Link to="/user/warranties-history" className="optionLink" onClick={closeSidebar}>Historial de Garantías</Link>
              </div>
            </li>
            <li>
              <div className={`optionContainer ${isActive('user-technical-service') ? 'active' : ''}`}>
                <Link to="/user/user-technical-service" className="optionLink" onClick={closeSidebar}>Servicio Técnico</Link>
              </div>
            </li>
            {/* 
            <li>
              <div className={`optionContainer ${isActive('user-technical-service') ? 'active' : ''}`}>
                <a href="https://gipsymx-my.sharepoint.com/:w:/g/personal/desarrollo_grupogipsy_com/EUb4GDoCEIFMtbQOoYi264MBsmMGd8auSJfj_hQ1bqN7yQ?e=lrP8vX" className="optionLink" onClick={closeSidebar} target='_blank'>Servicio Técnico</a>
              </div>
            </li>
            */}
          </ul>
          <ul className="bottomMenu">
            <li>
              {/* Editar Perfil */}
              <div className={`optionContainer ${isActive('edit-profile') ? 'active' : ''}`}>
                <Link to="/user/edit-profile" className="optionLink" onClick={closeSidebar}>Editar Perfil</Link>
              </div>
            </li>
            <li>
              {/* Cambiar Contraseña */}
              <div className={`optionContainer ${isActive('change-password') ? 'active' : ''}`}>
                <Link to="/user/change-password" className="optionLink" onClick={closeSidebar}>Cambiar Contraseña</Link>
              </div>
            </li>
            {isAdmin && (
              <>
                <li className='navMenu'>
                  <div className={`optionContainer ${isActive('home') ? '' : ''}`}>
                    <Link to="/technical-service/home" className="optionLink" onClick={closeSidebar}>Ir a Portal de Servicio Técnico</Link>
                  </div>
                </li>
                <li>
                  <div className={`optionContainer ${isActive('home') ? '' : ''}`}>
                    <Link to="/admin/home" className="optionLink" onClick={closeSidebar}>Ir a Portal de Administrador</Link>
                  </div>
                </li>
              </>
            )}
            <li>
              {/* Opción Cerrar Sesión */}
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

export default SidebarUser;