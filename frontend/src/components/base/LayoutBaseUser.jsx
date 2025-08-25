import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarUser from './SidebarUser';
import '../../styles/base/menu.css';
import '../../styles/base/home.css';

const LayoutBaseUser = ({ userFirstName, activePage, children }) => {
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
      <SidebarUser
        activePage={activePage}
        sidebarActive={sidebarActive}
        closeSidebar={closeSidebar}
        onLogout={onLogout}
      />

      {/* Contenido principal */}
      <div className={`main-content ${sidebarActive ? 'sidebar-open' : ''}`} id='mainContentUser'> {/* Nueva clase sidebar-open para el main-content */}
        {children}
      </div>
    </div>
  );
};

export default LayoutBaseUser;