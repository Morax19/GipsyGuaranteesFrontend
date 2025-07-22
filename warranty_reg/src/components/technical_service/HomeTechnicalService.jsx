import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutBaseTechServ from '../base/LayoutBaseTechServ';
import '../../styles/technical_service/homeTechServ.css';

const Home = ({ userFirstName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/technical-service/guarantee-details/${searchTerm.trim()}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <LayoutBaseTechServ activePage="home">
      <div className="home-tech-container">
        {/* Sección del Saludo (alineada arriba) */}
        <div className="greeting-section">
          <h2>Servicio Técnico de Garantías Gipsy</h2>
          <h3>Bienvenido(a), {userFirstName}</h3>
        </div>

        {/* Contenedor central para la sección de búsqueda */}
        <div className="search-and-label-wrapper">
          {/* Texto "Verifique el estado..." alineado a la izquierda */}
          <p className="search-label">Verifique el estado de una garantía registrada:</p>
          
          {/* Sección de Búsqueda (centrada) */}
          <div className="search-section-home">
            <input
              type="text"
              placeholder="Ingrese código de garantía..."
              className="search-input-home"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="search-button-home" onClick={handleSearch}>Buscar</button>
          </div>
        </div>
      </div>
    </LayoutBaseTechServ>
  );
};

export default Home;