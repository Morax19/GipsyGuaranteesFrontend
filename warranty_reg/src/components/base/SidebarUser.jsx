import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../../SessionContext';
import '../../styles/base/menu.css';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png'

const SidebarUser = ({ activePage, sidebarActive, closeSidebar }) => {
  const isActive = (page) => activePage === page;
  const { onLogout } = useSession();

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`} id="sidebarUser">
        <div className="logo">
            <img src={logo} alt="Gipsy's logo" />
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
              {/* Editar Perfil */}
              <div className={`optionContainer ${isActive('edit-profile') ? 'active' : ''}`}>
                <Link to="/edit-profile" className="optionLink" onClick={closeSidebar}>Editar Perfil</Link>
              </div>
            </li>
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

export default SidebarUser;