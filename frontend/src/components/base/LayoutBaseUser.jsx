import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SidebarUser from './SidebarUser';
import '../../styles/base/menu.css';
import '../../styles/base/home.css';

const LayoutBaseUser = ({ userFirstName, activePage, children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => setSidebarActive(!sidebarActive);
  const closeSidebar = () => setSidebarActive(false);
  const onLogout = () => {
    // Clear session token and accepted terms, dispatch logout event so other components can react
    try {
      sessionStorage.removeItem('session_token');
      sessionStorage.removeItem('gipsy_accepted_terms');
    } catch (e) {
      // ignore storage errors
    }
    // notify other parts of the app
    try {
      window.dispatchEvent(new Event('gipsy_logout'));
    } catch (e) {
      // ignore
    }
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