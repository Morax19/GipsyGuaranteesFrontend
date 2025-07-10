import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/menuBlue.css';
import '../styles/homeBlue.css';


const HomeBase = ({ userFirstName, activePage, children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => setSidebarActive(!sidebarActive);
  const closeSidebar = () => setSidebarActive(false);
  const isActive = (page) => activePage === page;

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`} id="sidebar">
        <div className="logo">
          <Link to="/homeSeller">
            <img src="/IMG/Gipsy_imagotipo_color.png" alt="Gipsy's logo" />
          </Link>
        </div>
        <div className="containerSideBar">
          <ul>
            <li>
              <div className={`optionContainer ${isActive('homeSeller') ? 'active' : ''}`}>
                {isActive('homeSeller') && <div className="verticalLine"></div>}
                <Link to="/homeSeller" className="optionLink">Inicio</Link>
              </div>
            </li>
            <li>
              <div className={`optionContainer ${isActive('accountsReceivable') ? 'active' : ''}`}>
                {isActive('accountsReceivable') && <div className="verticalLine"></div>}
                <Link to="/accountsReceivable" className="optionLink">Cuentas por Cobrar</Link>
              </div>
            </li>
          </ul>
          <ul className="bottomMenu">
            <li>
              <div className={`optionContainer ${isActive('loginReceipt') ? 'active' : ''}`}>
                {isActive('loginReceipt') && <div className="verticalLine"></div>}
                <Link to="/welcome" className="optionLink">Menú Principal</Link>
              </div>
              <div className={`optionContainer ${isActive('loginCashflow') ? 'active' : ''}`}>
                {isActive('loginCashflow') && <div className="verticalLine"></div>}
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
            <img src="/IMG/menu_icon.png" alt="Menu Icon" />
          </div>
          <div className="logoMobile">
            <Link to="/homeSeller">
              <img src="/IMG/Gipsy_imagotipo_color.png" alt="Gipsy's logo" />
            </Link>
          </div>
          <div className="space2"></div>
        </header>

        {/* Page-specific content */}
        {children}
      </div>
    </div>
  );
};

export default HomeBase;