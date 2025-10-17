import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/base/menu.css';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import logo from '../../assets/IMG/Gipsy_imagotipo_medioBlanco.png'

const SidebarTech = ({ activePage, sidebarActive, closeSidebar, onLogout }) => {
  const isActive = (page) => activePage === page;

  const {user_id, user_first_name, email_address, role} = getCurrentUserInfo();
  const isAdmin = role === 'Administrador';

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
                  <div className={`optionContainer ${isActive('login') ? 'active' : ''}`}>
                    <Link to="/user/home" className="optionLink" onClick={closeSidebar}>Ir a Portal de Usuario</Link>
                  </div>
                </li>
                <li>
                  <div className={`optionContainer ${isActive('login') ? 'active' : ''}`}>
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