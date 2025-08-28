import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import LayoutBaseTechServ from '../base/LayoutBaseTechServ';
import eye from '../../assets/IMG/ojo.png';
import '../../styles/technical_service/warrantiesList.css';
import WarrantyDetailsModal from './WarrantyDetailsModal';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

const WarrantiesList = () => {

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
  const [primaryFilter, setPrimaryFilter] = useState('');
  const [secondaryFilter, setSecondaryFilter] = useState('');
  const [secondaryFilterOptions, setSecondaryFilterOptions] = useState([]);
  const [allWarranties, setAllWarranties] = useState([]);
  const [filteredWarranties, setFilteredWarranties] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedwarranty, setSelectedwarranty] = useState(null);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Fetch warranties only once when component mounts
  useEffect(() => {
    async function fetchAllWarranties() {
      try {
        const response = await fetchWithAuth(
          `${apiUrl}/api/technicalServiceHistory/?userID=${user_id}`,
          {
            method: 'GET',
          }
        );
        const data = await response.json();
        if (response.ok) {
          setAllWarranties(data);
        } else {
          console.log(data.error || 'Error fetching warranties');
          alert(data.error || 'Error al obtener las garantías')
        }
      } catch {
        console.log('Error de conexión con el servidor');
        alert('Error de conexión con el servidor')
      }
    }
    fetchAllWarranties();
  }, []);

  // Filtering and sorting logic
  useEffect(() => {
    let currentWarranties = allWarranties;

    // --- Ordenar por fecha si no hay filtro primario ---
    if (!primaryFilter) {
      currentWarranties = [...currentWarranties].sort(
        (a, b) => new Date(a.receptionDate) - new Date(b.receptionDate)
      );
    }

    // --- Búsqueda de Código de Garantía ---
    if (searchTerm) {
      currentWarranties = currentWarranties.filter(warranty =>
        String(warranty.warrantyID).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // --- Poblado de opciones del filtro secundario ---
    let newSecondaryOptions = [];
    if (primaryFilter === 'fecha') {
      const months = [...new Set(currentWarranties.map(g => new Date(g.receptionDate).getMonth()))]
        .sort((a, b) => a - b)
        .map(monthNum => ({ value: String(monthNum), label: monthNames[monthNum] }));
      newSecondaryOptions = months;
    } else if (primaryFilter === 'Description') {
      const products = [...new Set(currentWarranties.map(g => g.Description))].sort();
      newSecondaryOptions = products.map(p => ({ value: p, label: p }));
    } else if (primaryFilter === 'companyName') {
      const stores = [...new Set(currentWarranties.map(g => g.companyName))].sort();
      newSecondaryOptions = stores.map(s => ({ value: s, label: s }));
    } else if (primaryFilter === 'statusDescription') {
      const statuses = [...new Set(currentWarranties.map(g => g.statusDescription))].sort();
      newSecondaryOptions = statuses.map(s => ({ value: s, label: s }));
    }
    setSecondaryFilterOptions(newSecondaryOptions);

    if (primaryFilter !== '' && secondaryFilter !== '' && !newSecondaryOptions.some(opt => opt.value === secondaryFilter)) {
        setSecondaryFilter('');
    } else if (primaryFilter === '' && secondaryFilter !== '') {
        setSecondaryFilter('');
    }

    if (primaryFilter && secondaryFilter !== '') {
      if (primaryFilter === 'fecha') {
        currentWarranties = currentWarranties.filter(warranty =>
          String(new Date(warranty.receptionDate).getMonth()) === secondaryFilter
        );
      } else if (primaryFilter === 'Description') {
        currentWarranties = currentWarranties.filter(warranty =>
          warranty.Description === secondaryFilter
        );
      } else if (primaryFilter === 'companyName') {
        currentWarranties = currentWarranties.filter(warranty =>
          warranty.companyName === secondaryFilter
        );
      } else if (primaryFilter === 'statusDescription') {
        currentWarranties = currentWarranties.filter(warranty =>
          warranty.statusDescription === secondaryFilter
        );
      }
    }

    if (primaryFilter === 'Description') {
      currentWarranties.sort((a, b) => a.Description.localeCompare(b.Description));
    } else if (primaryFilter === 'fecha') {
      currentWarranties.sort((a, b) => new Date(a.receptionDate) - new Date(b.receptionDate));
    } else if (primaryFilter === 'companyName') {
      currentWarranties.sort((a, b) => a.companyName.localeCompare(b.companyName));
    } else if (primaryFilter === 'statusDescription') {
        currentWarranties.sort((a, b) => a.statusDescription.localeCompare(b.statusDescription));
    }

    setFilteredWarranties(currentWarranties);
  }, [searchTerm, primaryFilter, secondaryFilter, allWarranties]);

  // --- Detalles de la Garantía ---

  const handleViewDetails = (warrantyCaseNumber) => {
    const warranty = allWarranties.find(g => g.CaseNumber === warrantyCaseNumber);
    setSelectedwarranty(warranty);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedwarranty(null);
  };

  const handleUpdatewarrantyInList = (updatedwarranty) => {
    setAllWarranties(prevWarranties =>
      prevWarranties.map(g => (g.CaseNumber === updatedwarranty.CaseNumber ? updatedwarranty : g))
    );
  };

  return (
    <LayoutBaseTechServ activePage="warrantiesList">
      <div className="warranties-list-container">
        <div className="title-section">
          <h2>Historial de Servicios</h2>
        </div>

        <div className="filters-and-search">
          <input
            type="text"
            placeholder="Buscar por código de garantía..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={primaryFilter}
            onChange={(e) => setPrimaryFilter(e.target.value)}
          >
            <option value="">Filtrar por...</option>
            <option value="Description">Producto</option>
            <option value="fecha">Fecha</option>
            <option value="companyName">Compañía</option>
            <option value="statusDescription">Estado</option>
          </select>

          {/* El filtro secundario solo es visible si se elige un filtro primario y hay opciones */}
          {primaryFilter && secondaryFilterOptions.length > 0 && (
            <select
              className="filter-select"
              value={secondaryFilter}
              onChange={(e) => setSecondaryFilter(e.target.value)}
              disabled={secondaryFilterOptions.length === 0}
            >
              <option value="">
                {primaryFilter === 'fecha' && 'Seleccione un mes'}
                {primaryFilter === 'Description' && 'Seleccione un Description'}
                {primaryFilter === 'companyName' && 'Seleccione una companyName'}
                {primaryFilter === 'statusDescription' && 'Seleccione un statusDescription'}
                {!primaryFilter && 'Seleccione una opción...'}
              </option>
              {secondaryFilterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="warranties-table-container">
          {filteredWarranties.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Código de Garantía</th>
                  <th>Fecha de Recepción</th>
                  <th>Cliente</th>
                  <th>Compañía</th>
                  <th>Producto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredWarranties.map(warranty => (
                  <tr key={warranty.CaseNumber}>
                    <td>{warranty.warrantyID}</td>
                    <td>{warranty.receptionDate}</td>
                    <td>{warranty.Customer}</td>
                    <td>{warranty.companyName}</td>
                    <td>{warranty.Description}</td>
                    <td><span className={`status-${warranty.statusDescription.replace(/\s+/g, '-').toLowerCase()}`}>{warranty.statusDescription}</span></td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => handleViewDetails(warranty.CaseNumber)}
                        title="Ver detalles"
                      >
                        <img src={eye} alt="Ver detalles" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-results">No se encontraron garantías activas.</p>
          )}
        </div>
      </div>

      {/* Renderización del Modal */}
      <WarrantyDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        warranty={selectedwarranty}
        onUpdatewarranty={handleUpdatewarrantyInList}
      />

    </LayoutBaseTechServ>
  );
};

export default WarrantiesList;