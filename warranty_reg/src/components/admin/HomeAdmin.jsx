import React from 'react';
import { fetchWithAuth } from '../../fetchWithAuth';
import { useSession } from '../../SessionContext';
import LayoutBaseAdmin from '../base/LayoutBaseAdmin';

const HomeAdmin = ({ userFirstName }) => {
  return (
    <LayoutBaseAdmin activePage="home">
      <div className="content">
        <div className="title-container">
          <div className="title-center">
            <h2>Control de Garantías Gipsy</h2>
          </div>
          <div className="title-center">
            <h3>Bienvenido(a), Administrador(a) {userFirstName}</h3>
          </div>
        </div>
      </div>
    </LayoutBaseAdmin>
  );
};

export default HomeAdmin;