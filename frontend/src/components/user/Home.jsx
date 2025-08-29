import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import { useNavigate } from 'react-router-dom';
import LayoutBase from '../base/LayoutBaseUser';
import image from '../../assets/IMG/WarrancyWallpaper.jpg';

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
          src={image}
          alt="Seller Wallpaper"
          style={{ width: '100%', maxWidth: '1300px', display: 'block' }}
        />
      </div>
    </LayoutBase>
  );
};

export default Home;