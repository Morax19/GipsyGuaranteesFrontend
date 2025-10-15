import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './SidebarTech';
import '../../styles/base/menu.css';
import '../../styles/base/home.css';

const LayoutBaseTechServ = ({ userFirstName, activePage, children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => setSidebarActive(!sidebarActive);
  const closeSidebar = () => setSidebarActive(false);
  const onLogout = () => {
    sessionStorage.removeItem('session_token');
    navigate('/');
  }

  return (
    <div className="layout">
      {/* El Sidebar ahora es un componente separado */}
      <Sidebar
        activePage={activePage}
        sidebarActive={sidebarActive}
        closeSidebar={closeSidebar}
        onLogout={onLogout}
      />

      {/* Contenido principal */}
      <div className={`main-content ${sidebarActive ? 'sidebar-open' : ''}`} id='mainContentTech'>
        {/* <header>
          <div className="menu-icon" onClick={toggleSidebar}>
            <img src="/IMG/menu_icon.png" alt="Menu Icon" />
          </div>
          <div className="logoMobile">
            <Link to="/homeSeller">
              <img src="/IMG/Gipsy_imagotipo_color.png" alt="Logo" />
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

export default LayoutBaseTechServ;