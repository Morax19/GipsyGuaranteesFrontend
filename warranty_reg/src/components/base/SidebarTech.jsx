import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../../SessionContext';
import '../../styles/base/menuGrey.css';
import logo from '../../assets/IMG/Gipsy_imagotipo_medioBlanco.png'

const SidebarTech = ({ activePage, sidebarActive, closeSidebar }) => {
  const isActive = (page) => activePage === page;
  const { onLogout } = useSession();

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`} id="sidebar">
        <div className="logo">
            <img src={logo} alt="Gipsy's logo" />
        </div>
        <div className="containerSideBar">
          <ul>
            <li>
              <div className={`optionContainer ${isActive('home') ? 'active' : ''}`}>
                <Link to="/technical-service/home" className="optionLink" onClick={closeSidebar}>Inicio</Link>
              </div>
            </li>
            <li>
              <div className={`optionContainer ${isActive('guaranteesList') ? 'active' : ''}`}>
                <Link to="/technical-service/open-guarantees" className="optionLink" onClick={closeSidebar}>Casos Abiertos</Link>
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