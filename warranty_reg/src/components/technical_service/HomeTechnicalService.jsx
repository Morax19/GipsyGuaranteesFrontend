import React from 'react';
import { fetchWithAuth } from '../../fetchWithAuth';
import { useSession } from '../../SessionContext';
import LayoutBase from '../base/LayoutBaseTechServ';
import image from '../../assets/IMG/WarrancyWallpaper.jpg';
import LayoutBaseTechServ from '../base/LayoutBaseTechServ';

const Home = ({ userFirstName }) => {
  return (
    <LayoutBaseTechServ activePage="home">
      <div className="content">
        <div className="title-container">
          <div className="title-center">
            <h2>Servicio Técnico de Garantías Gipsy</h2>
          </div>
          <div className="title-center">
            <h3>Bienvenido(a), {userFirstName}</h3>
          </div>
        </div>
      </div>
    </LayoutBaseTechServ>
  );
};

export default Home;