import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './menuBlue.css';
import './homeBlue.css';

const SidebarLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const closeSidebar = () => {
    setSidebarActive(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`} id="sidebar">
        <div className="logo">
          <Link to="">
            <img src="/static/IMG/Gipsy_imagotipo_color.png" alt="Gipsy's logo" />
          </Link>
        </div>
        <div className="containerSideBar">
          <ul>
            <li>
              <div className={`optionContainer ${isActive('/homeSeller') ? 'active' : ''}`}>
                {isActive('/homeSeller') && <div className="verticalLine"></div>}
                <Link to="/homeSeller" className="optionLink">Inicio</Link>
              </div>
            </li>
            <li>
              <div className={`optionContainer ${isActive('/accountsReceivable') ? 'active' : ''}`}>
                {isActive('/accountsReceivable') && <div className="verticalLine"></div>}
                <Link to="/accountsReceivable" className="optionLink">Cuentas por Cobrar</Link>
              </div>
            </li>
          </ul>

          <ul className="bottomMenu">
            <li>
              <div className={`optionContainer ${isActive('/welcome') ? 'active' : ''}`}>
                {isActive('/welcome') && <div className="verticalLine"></div>}
                <Link to="/welcome" className="optionLink">Menú Principal</Link>
              </div>
              <div className={`optionContainer ${isActive('/index') ? 'active' : ''}`}>
                {isActive('/index') && <div className="verticalLine"></div>}
                <Link to="/index" className="optionLink">Cerrar Sesión</Link>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Background overlay */}
      <div
        className={`backgroundOpacity ${sidebarActive ? 'active' : ''}`}
        id="backgroundOpacity"
        onClick={closeSidebar}
      ></div>

      {/* Main content */}
      <div className="main-content">
        <header>
          <div className="menu-icon" onClick={toggleSidebar}>
            <img src="/static/IMG/menu_icon.png" alt="Menu Icon" />
          </div>
          <div className="logoMobile">
            <Link to="/homeSeller">
              <img src="/static/IMG/Gipsy_imagotipo_color.png" alt="Gipsy's logo" />
            </Link>
          </div>
          <div className="space2"></div>
        </header>

        {/* Dynamic content goes here */}
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;