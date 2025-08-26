import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import { useNavigate } from 'react-router-dom';
import LayoutBaseTechServ from '../base/LayoutBaseTechServ';
import '../../styles/technical_service/homeTechServ.css';
import SearchedWarrantyDetailsModal from './SearchedWarrantyDetailsModal';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

const Home = () => {

  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      alert('Por favor, inicie sesión para acceder a esta página.');
      navigate('/technical-service/login');
      return null;
    }
  }, [navigate]);

  const {user_id, email_address, role} = getCurrentUserInfo();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foundWarranty, setFoundWarranty] = useState(null);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      async function fetchWarrantyById() {
        try {
          const response = await fetchWithAuth(
            `${apiUrl}/api/technicalServiceGetWarrantyByID/?WarrantyNumber=${searchTerm.trim()}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          if (response.ok) {
            const data = await response.json();
            setFoundWarranty(data);
            setIsModalOpen(true);
          } else {
            alert('Garantía no encontrada.');
            setFoundWarranty(null);
            setIsModalOpen(false);
          }
        } catch {
          alert('Error de conexión con el servidor');
        }
      }
      fetchWarrantyById();
    } else {
      alert('Por favor, ingrese un código de garantía.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleOpenCaseFromModal = async (warrantyToOpenCase) => {
    console.log('Solicitud para abrir caso para:', warrantyToOpenCase.WarrantyNumber);

    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/technicalServiceOpenCaseWarranty/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            registerID: user_id,
            WarrantyID: warrantyToOpenCase.WarrantyNumber
          })
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(`Se ha abierto un caso para la garantía: ${warrantyToOpenCase.WarrantyNumber}.`);
        setIsModalOpen(false);
      } else {
        alert(data.error || 'Error al abrir el caso. Intente nuevamente.');
      }
    } catch (error) {
      console.error('Error de conexión con el servidor:', error);
      alert('Error de conexión con el servidor');
    }

    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/updateWarrantyUsedCount/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            WarrantyID: foundWarranty.WarrantyNumber
          })
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(`Se ha actualizado el conteo de usos para la garantía: ${foundWarranty.WarrantyNumber}.`);
      } else {
        alert(data.error || 'Error al actualizar el conteo de usos. Intente nuevamente.');
      }
    } catch (error) {
      console.error('Error de conexión con el servidor:', error);
      alert('Error de conexión con el servidor');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFoundWarranty(null);
  };

  return (
    <LayoutBaseTechServ activePage="home">
      <div className="home-tech-container">
        <div className="greeting-section">
          <h2>Servicio Técnico de Garantías Gipsy</h2>
          <h3>Bienvenido(a), { email_address }</h3>
        </div>

        <div className="search-and-label-wrapper">
          <p className="search-label">Verifique el estado de una garantía registrada:</p>
          
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

      {/* Renderiza el nuevo modal aquí, controlando su visibilidad */}
      <SearchedWarrantyDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        warranty={foundWarranty}
        onOpenCase={handleOpenCaseFromModal}
      />
    </LayoutBaseTechServ>
  );
};

export default Home;