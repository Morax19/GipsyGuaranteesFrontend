import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/menuBlue.css';
import '../styles/homeBlue.css';

const LayoutBase = ({ userFirstName, activePage, children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => setSidebarActive(!sidebarActive);
  const closeSidebar = () => setSidebarActive(false);

  return (
    <div className="layout">
      {/* El Sidebar ahora es un componente separado */}
      <Sidebar
        activePage={activePage}
        sidebarActive={sidebarActive}
        closeSidebar={closeSidebar}
      />

      {/* Contenido principal */}
      <div className={`main-content ${sidebarActive ? 'sidebar-open' : ''}`}> {/* Nueva clase sidebar-open para el main-content */}
        {/* <header>
          <div className="menu-icon" onClick={toggleSidebar}>
            <img src="/IMG/menu_icon.png" alt="Menu Icon" />
          </div>
          <div className="logoMobile">
            <Link to="/homeSeller">
              <img src="/IMG/Gipsy_imagotipo_color.png" alt="Gipsy's logo" />
            </Link>
          </div>
          <div className="user-info">
            Hola, {userFirstName}
          </div>
        </header> */}
        {/* Contenido específico de la página (children) */}
        {children}
      </div>
    </div>
  );
};

export default LayoutBase;