import React, { useState } from 'react';
import { useEffect } from 'react';
import { fetchWithAuth } from '../../fetchWithAuth';
import { useNavigate } from 'react-router-dom';
import LayoutBaseTechServ from '../base/LayoutBaseTechServ';
import '../../styles/technical_service/homeTechServ.css';
import SearchedWarrantyDetailsModal from './SearchedWarrantyDetailsModal';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

const Home = ({ userFirstName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foundWarranty, setFoundWarranty] = useState(null);
  const [allWarranties, setAllWarranties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWarranties() {
      try {
        const response = await fetchWithAuth(
          `${apiUrl}/api/TechnicalServicesWarrantyView/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('session_token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        if (response.ok) {
          setAllWarranties(data);
        } else {
          console.log(data.message || 'Error fetching warranties');
        }
      } catch {
        console.log('Error de conexión con el servidor');
      }
    }
    fetchWarranties();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      async function fetchWarrantyById() {
        try {
          const response = await fetchWithAuth(
            `${apiUrl}/api/TechnicalServicesWarrantyView/${searchTerm.trim()}/`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('session_token')}`,
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

  const handleOpenCaseFromModal = (warrantyToOpenCase) => {
    console.log('Solicitud para abrir caso para:', warrantyToOpenCase.codigo);
    alert(`Se ha abierto un caso para la garantía: ${warrantyToOpenCase.codigo}.`);
    setIsModalOpen(false);
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
          <h3>Bienvenido(a), {userFirstName || "Usuario"}</h3>
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