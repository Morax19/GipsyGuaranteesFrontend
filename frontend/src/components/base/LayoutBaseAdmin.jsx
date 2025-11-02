import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';
import '../../styles/base/menu.css';
import '../../styles/base/home.css';

const LayoutBaseAdmin = ({ userFirstName, activePage, children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarActive(!sidebarActive);
  const closeSidebar = () => setSidebarActive(false);
  const onLogout = () => {
    try { sessionStorage.removeItem('session_token'); } catch (e) { /* ignore */ }
    navigate('/');
  };
  
  return (
    <div className="layout">
      {/* overlay used on small screens to close the sidebar when clicking outside */}
      <div
        className={`backgroundOpacity ${sidebarActive ? 'active' : ''}`}
        onClick={closeSidebar}
        aria-hidden={!sidebarActive}
      />

      {/* El Sidebar ahora es un componente separado */}
      <SidebarAdmin
        activePage={activePage}
        sidebarActive={sidebarActive}
        closeSidebar={closeSidebar}
        onLogout={onLogout}
      />

      {/* Contenido principal */}
      <div className={`main-content ${sidebarActive ? 'sidebar-open' : ''}`} id='mainContentAdmin'>
        {/* small header with menu button for toggling sidebar on mobile */}
        <header className="header header--admin">
          <button
            className="menu-icon menu-icon--admin"
            onClick={toggleSidebar}
            aria-label={sidebarActive ? 'Cerrar menú' : 'Abrir menú'}
          >
            ☰
          </button>
          <div style={{ flex: 1 }} />
        </header>

        {children}
      </div>
    </div>
  );
};

export default LayoutBaseAdmin;