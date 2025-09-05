import React, { useState, useEffect } from 'react';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import { useNavigate } from 'react-router-dom';
import LayoutBase from '../base/LayoutBaseUser';
import imageHome from '../../assets/IMG/WarrantyWallpaperClientHome.png';

const Home = () => {

  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      alert('Por favor, inicie sesión para acceder a esta página.');
      navigate('/user/login');
      return null;
    }
  }, [navigate]);

  const {user_id, user_first_name, email_address, role} = getCurrentUserInfo();

  return (
    <LayoutBase activePage="home">
      <div className="content">
        <div className="title-container">
          <div className="title-center">
            <h2>Control de Garantías Gipsy</h2>
          </div>
          <div className="title-center">
            <h3>Bienvenido(a), {user_first_name}</h3>
          </div>
        </div>
        <img
          src={imageHome}
          alt="Seller Wallpaper"
          style={{
            width: '100%',
            maxWidth: '1100px',
            display: 'block',
            margin: '32px auto',
            borderRadius: '18px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            border: '1px solid #e0e0e0',
            objectFit: 'cover'
          }}
        />
      </div>
    </LayoutBase>
  );
};

export default Home;