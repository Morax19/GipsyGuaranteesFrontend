import React from 'react';
import HomeBase from '../components/HomeBase'; // Adjust path if needed

const Home = ({ userFirstName }) => {
  return (
    <HomeBase userFirstName={userFirstName} activePage="homeSeller">
      <div className="content">
        <div className="title-container">
          <div className="title-center">
            <h2>Registro de Cobranza Gipsy</h2>
          </div>
          <div className="title-center">
            <h2>Bienvenido(a), vendedor(a) {userFirstName}</h2>
          </div>
        </div>
        <img
          src="/IMG/seller_Wallpaper.png"
          alt="Seller Wallpaper"
          style={{ width: '100%', maxWidth: '800px', margin: '2rem auto', display: 'block' }}
        />
      </div>
    </HomeBase>
  );
};

export default Home;