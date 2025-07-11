import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/menuBlue.css';
import logo from '../assets/IMG/Gipsy_imagotipo_color.png'

const Sidebar = ({ activePage, sidebarActive, closeSidebar }) => {
  const isActive = (page) => activePage === page;

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`} id="sidebar">
        <div className="logo">
          <Link to="/homeSeller" onClick={closeSidebar}>
            <img src={logo} alt="Gipsy's logo" />
          </Link>
        </div>
        <div className="containerSideBar">
          <ul>
            <li>
              <div className={`optionContainer ${isActive('home') ? 'active' : ''}`}>
                <Link to="/home" className="optionLink" onClick={closeSidebar}>Inicio</Link>
              </div>
            </li>
            <li>
              <div className={`optionContainer ${isActive('warranty') ? 'active' : ''}`}>
                <Link to="/warranty" className="optionLink" onClick={closeSidebar}>Registrar Garantía</Link>
              </div>
            </li>
            <li>
              <div className={`optionContainer ${isActive('history') ? 'active' : ''}`}>
                <Link to="/history" className="optionLink" onClick={closeSidebar}>Historial de Garantías</Link>
              </div>
            </li>
            <li>
              <div className={`optionContainer ${isActive('user-technical-service') ? 'active' : ''}`}>
                <Link to="/user-technical-service" className="optionLink" onClick={closeSidebar}>Servicio Técnico</Link>
              </div>
            </li>
          </ul>
          <ul className="bottomMenu">
            <li>
              {/* Opción Cerrar Sesión */}
              <div className={`optionContainer ${isActive('login') ? 'active' : ''}`}>
                <Link to="/" className="optionLink" onClick={closeSidebar}>Cerrar Sesión</Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;