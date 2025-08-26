import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import LayoutBaseAdmin from '../base/LayoutBaseAdmin';

const HomeAdmin = () => {

  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      alert('Por favor, inicie sesión para acceder a esta página.');
      navigate('/admin/login');
      return null;
    }
  }, [navigate]);

  const {user_id, email_address, role} = getCurrentUserInfo();
  return (
    <LayoutBaseAdmin activePage="home">
      <div className="content">
        <div className="title-container">
          <div className="title-center">
            <h2>Control de Garantías Gipsy</h2>
          </div>
          <div className="title-center">
            <h3>Bienvenido(a), Administrador(a): {email_address}</h3>
          </div>
        </div>
      </div>
    </LayoutBaseAdmin>
  );
};

export default HomeAdmin;