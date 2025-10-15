import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/base/menu.css';
import logo from '../../assets/IMG/Gipsy_imagotipo_medioBlanco.png'

const SidebarAdmin = ({ activePage, sidebarActive, closeSidebar, onLogout }) => {
  const isActive = (page) => activePage === page;

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`} id="sidebarAdmin">
        <div className="logo">
            <Link to="/admin/home" onClick={closeSidebar}>
              <img src={logo} alt="Logo" />
            </Link>
        </div>
        <div className="containerSideBar">
          <ul>
            <li>
              <div className={`optionContainer ${isActive('home') ? 'active' : ''}`}>
                <Link to="/admin/home" className="optionLink" onClick={closeSidebar}>Inicio</Link>
              </div>
            </li>
            <li>
              <div className={`optionContainer ${isActive('usersTable') ? 'active' : ''}`}>
                <Link to="/admin/users-table" className="optionLink" onClick={closeSidebar}>Usuarios</Link>
              </div>
            </li>
            <li>
              <div className={`optionContainer ${isActive('branchesTable') ? 'active' : ''}`}>
                <Link to="/admin/branches-table" className="optionLink" onClick={closeSidebar}>Sucursales</Link>
              </div>
            </li>
            <li>
              <div className={`optionContainer ${isActive('failsTable') ? 'active' : ''}`}>
                <Link to="/admin/fails-table" className="optionLink" onClick={closeSidebar}>Fallas de Productos</Link>
              </div>
            </li>
            <li>
              <div className={`optionContainer ${isActive('warrantyReport') ? 'active' : ''}`}>
                <a href="https://app.powerbi.com/groups/me/reports/16c30b6d-ce45-4692-ba22-5cb0e9cbca3b/327f1368f65acaa57287?ctid=e28fcd45-30d5-4919-b266-27bca9760759&experience=power-bi&chromeless=1" className="optionLink" onClick={closeSidebar} target='_blank'>Reporte Garantías</a>
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

export default SidebarAdmin;