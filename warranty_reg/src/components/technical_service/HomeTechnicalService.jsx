import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutBaseTechServ from '../base/LayoutBaseTechServ';
import '../../styles/technical_service/homeTechServ.css';
import SearchedWarrantyDetailsModal from './SearchedWarrantyDetailsModal';

// --- Datos de Garantías de ejemplo ---
const allMockWarranties = [
    {
        id: 'G001',
        codigo: 'ABC-123',
        purchaseDate: '2024-01-15',
        invoiceNumber: 'INV-1001',
        MarcaProducto: 'Samsung',
        ModeloProducto: 'Galaxy S23',
        usedCount: 0,
    },
    {
        id: 'G002',
        codigo: 'DEF-456',
        purchaseDate: '2025-05-01',
        invoiceNumber: 'INV-1002',
        MarcaProducto: 'LG',
        ModeloProducto: 'OLED C2',
        usedCount: 1,
    },
    {
        id: 'G003',
        codigo: 'GHI-789',
        purchaseDate: '2025-01-20',
        invoiceNumber: 'INV-1003',
        MarcaProducto: 'Sony',
        ModeloProducto: 'WH-1000XM5',
        usedCount: 2,
    },
    {
        id: 'G004',
        codigo: 'JKL-101',
        purchaseDate: '2025-05-20',
        invoiceNumber: 'INV-1004',
        MarcaProducto: 'Apple',
        ModeloProducto: 'MacBook Air M3',
        usedCount: 1,
    },
];


const Home = ({ userFirstName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foundWarranty, setFoundWarranty] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {

      // --- Simulación de búsqueda con mock data ---
      const found = allMockWarranties.find(g => g.codigo === searchTerm.trim().toUpperCase());
      if (found) {
        setFoundWarranty(found);
        setIsModalOpen(true);
      } else {
        alert('Garantía no encontrada.');
        setFoundWarranty(null);
        setIsModalOpen(false);
      }
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