import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../../SessionContext';
import '../../styles/base/menu.css';
import logo from '../../assets/IMG/Gipsy_imagotipo_medioBlanco.png'

const SidebarTech = ({ activePage, sidebarActive, closeSidebar }) => {
  const isActive = (page) => activePage === page;
  const { onLogout } = useSession();

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`} id="sidebarTech">
        <div className="logo">
            <Link to="/technical-service/home" onClick={closeSidebar}>
              <img src={logo} alt="Gipsy's logo" />
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

export default SidebarTech;