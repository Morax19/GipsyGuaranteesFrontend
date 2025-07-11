import React from 'react';
import LayoutBase from './LayoutBase';
import image from '../assets/IMG/WarrancyWallpaper.jpg';

const Home = ({ userFirstName }) => {
  return (
    <LayoutBase activePage="home">
      <div className="content">
        <div className="title-container">
          <div className="title-center">
            <h2>Control de Garantías Gipsy</h2>
          </div>
          <div className="title-center">
            <h3>Bienvenido(a), Pepe Pérez</h3>
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