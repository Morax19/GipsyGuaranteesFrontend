import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarUser from './SidebarUser';
import '../../styles/base/menu.css';
import '../../styles/base/home.css';

const LayoutBaseUser = ({ userFirstName, activePage, children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarActive(!sidebarActive);
  const closeSidebar = () => setSidebarActive(false);

  const onLogout = () => {
    try {
      sessionStorage.removeItem('session_token');
      sessionStorage.removeItem('accepted_terms');
    } catch (e) {
      // ignore storage errors
    }
    try {
      window.dispatchEvent(new Event('guarantees_logout'));
    } catch (e) {
      // ignore
    }
    navigate('/');
  };

  return (
    <div className="layout">
      {/* Background overlay that closes the sidebar when clicked (used on small screens) */}
      <div
        className={`backgroundOpacity ${sidebarActive ? 'active' : ''}`}
        onClick={closeSidebar}
        aria-hidden={!sidebarActive}
      />

      {/* El Sidebar ahora es un componente separado */}
      <SidebarUser
        activePage={activePage}
        sidebarActive={sidebarActive}
        closeSidebar={closeSidebar}
        onLogout={onLogout}
      />

      {/* Contenido principal */}
      <div className={`main-content ${sidebarActive ? 'sidebar-open' : ''}`} id="mainContentUser">
        {/* Header with menu button (visible on small screens) */}
        <header className="header header--user">
          <button
            className="menu-icon menu-icon--user"
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

export default LayoutBaseUser;