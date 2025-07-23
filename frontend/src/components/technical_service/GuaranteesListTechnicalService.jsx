import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../fetchWithAuth';
import { useSession } from '../../SessionContext';
import LayoutBaseTechServ from '../base/LayoutBaseTechServ';
import eye from '../../assets/IMG/ojo.png';
import '../../styles/technical_service/guaranteesList.css';
import GuaranteeDetailsModal from './GuaranteesDetailsModal';

// --- Data de ejemplo ---
const mockGuarantees = [
  {
    id: 'G001',
    codigo: 'ABC-123-X',
    fechaRecepcion: '2024-07-01',
    fechaRevision: null,
    nombreCliente: 'Juan Pérez',
    tienda: 'ElectroMega',
    producto: 'Lavadora XYZ',
    estado: 'Abierto',
    diagnostico: '',
    descripcionAccion: '',
  },
  {
    id: 'G002',
    codigo: 'DEF-456-Y',
    fechaRecepcion: '2024-07-05',
    fechaRevision: '2024-07-10',
    nombreCliente: 'María López',
    tienda: 'TecnoGlobal',
    producto: 'Televisor QLED',
    estado: 'En Revisión',
    diagnostico: 'Falla de conexión',
    descripcionAccion: 'Se restableció la conexión y se probó el equipo.',
  },
  {
    id: 'G003',
    codigo: 'GHI-789-Z',
    fechaRecepcion: '2024-06-10',
    fechaRevision: null,
    nombreCliente: 'Carlos García',
    tienda: 'MegaHogar',
    producto: 'Refrigerador Cool',
    estado: 'Abierto',
    diagnostico: '',
    descripcionAccion: '',
  },
  {
    id: 'G004',
    codigo: 'JKL-012-A',
    fechaRecepcion: '2024-08-12',
    fechaRevision: null,
    nombreCliente: 'Ana Fernández',
    tienda: 'ElectroMega',
    producto: 'Microondas Smart',
    estado: 'En Revisión',
    diagnostico: '',
    descripcionAccion: '',
  },
  {
    id: 'G005',
    codigo: 'MNO-345-B',
    fechaRecepcion: '2024-07-15',
    fechaRevision: null,
    nombreCliente: 'Luis Martínez',
    tienda: 'TecnoGlobal',
    producto: 'Aspiradora Robótica',
    estado: 'Abierto',
    diagnostico: '',
    descripcionAccion: '',
  },
  {
    id: 'G006',
    codigo: 'PQR-678-C',
    fechaRecepcion: '2024-08-20',
    fechaRevision: '2024-08-25',
    nombreCliente: 'Sofía Díaz',
    tienda: 'MegaHogar',
    producto: 'Horno Eléctrico',
    estado: 'Cerrado',
    diagnostico: 'Sin errores',
    descripcionAccion: 'El equipo funciona correctamente después de la revisión.',
    fechaCierre: '2024-08-25',
  },
  {
    id: 'G007',
    codigo: 'STU-901-D',
    fechaRecepcion: '2024-07-22',
    fechaRevision: null,
    nombreCliente: 'Pedro Gómez',
    tienda: 'ElectroMega',
    producto: 'Cafetera Express',
    estado: 'Cerrado',
    diagnostico: 'Falla de encendido',
    descripcionAccion: 'Se reemplazó el fusible y se probó la cafetera.',
    fechaCierre: '2024-07-25',
  },
];


const GuaranteesList = ({ userFirstName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [primaryFilter, setPrimaryFilter] = useState('');
  const [secondaryFilter, setSecondaryFilter] = useState('');
  const [secondaryFilterOptions, setSecondaryFilterOptions] = useState([]);
  const [allGuarantees, setAllGuarantees] = useState(mockGuarantees);
  const [filteredGuarantees, setFilteredGuarantees] = useState(mockGuarantees);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuarantee, setSelectedGuarantee] = useState(null);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  useEffect(() => {
    let currentGuarantees = allGuarantees;

    // --- Ordenar por fecha si no hay filtro primario ---
    if (!primaryFilter) {
      currentGuarantees = [...currentGuarantees].sort(
        (a, b) => new Date(a.fechaRecepcion) - new Date(b.fechaRecepcion)
      );
    }

    // --- Búsqueda de Código de Garantía ---
    if (searchTerm) {
      currentGuarantees = currentGuarantees.filter(guarantee =>
        guarantee.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // --- Poblado de opciones del filtro secundario ---
    let newSecondaryOptions = [];
    if (primaryFilter === 'fecha') {
      const months = [...new Set(currentGuarantees.map(g => new Date(g.fechaRecepcion).getMonth()))]
        .sort((a, b) => a - b)
        .map(monthNum => ({ value: String(monthNum), label: monthNames[monthNum] }));
      newSecondaryOptions = months;
    } else if (primaryFilter === 'producto') {
      const products = [...new Set(currentGuarantees.map(g => g.producto))].sort();
      newSecondaryOptions = products.map(p => ({ value: p, label: p }));
    } else if (primaryFilter === 'tienda') {
      const stores = [...new Set(currentGuarantees.map(g => g.tienda))].sort();
      newSecondaryOptions = stores.map(s => ({ value: s, label: s }));
    } else if (primaryFilter === 'estado') {
      const statuses = [...new Set(currentGuarantees.map(g => g.estado))].sort();
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
        currentGuarantees = currentGuarantees.filter(guarantee =>
          String(new Date(guarantee.fechaRecepcion).getMonth()) === secondaryFilter
        );
      } else if (primaryFilter === 'producto') {
        currentGuarantees = currentGuarantees.filter(guarantee =>
          guarantee.producto === secondaryFilter
        );
      } else if (primaryFilter === 'tienda') {
        currentGuarantees = currentGuarantees.filter(guarantee =>
          guarantee.tienda === secondaryFilter
        );
      } else if (primaryFilter === 'estado') {
        currentGuarantees = currentGuarantees.filter(guarantee =>
          guarantee.estado === secondaryFilter
        );
      }
    }

    if (primaryFilter === 'producto') {
      currentGuarantees.sort((a, b) => a.producto.localeCompare(b.producto));
    } else if (primaryFilter === 'fecha') {
      currentGuarantees.sort((a, b) => new Date(a.fechaRecepcion) - new Date(b.fechaRecepcion));
    } else if (primaryFilter === 'tienda') {
      currentGuarantees.sort((a, b) => a.tienda.localeCompare(b.tienda));
    } else if (primaryFilter === 'estado') {
        currentGuarantees.sort((a, b) => a.estado.localeCompare(b.estado));
    }

    setFilteredGuarantees(currentGuarantees);
  }, [searchTerm, primaryFilter, secondaryFilter, allGuarantees]);


  // --- Detalles de la Garantía ---

  const handleViewDetails = (guaranteeId) => {
    const guarantee = allGuarantees.find(g => g.id === guaranteeId);
    setSelectedGuarantee(guarantee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGuarantee(null);
  };

  const handleUpdateGuaranteeInList = (updatedGuarantee) => {
    setAllGuarantees(prevGuarantees =>
      prevGuarantees.map(g => (g.id === updatedGuarantee.id ? updatedGuarantee : g))
    );
  };

  return (
    <LayoutBaseTechServ activePage="guaranteesList">
      <div className="guarantees-list-container">
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
            <option value="producto">Producto</option>
            <option value="fecha">Fecha</option>
            <option value="tienda">Tienda</option>
            <option value="estado">Estado</option>
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
                {primaryFilter === 'producto' && 'Seleccione un producto'}
                {primaryFilter === 'tienda' && 'Seleccione una tienda'}
                {primaryFilter === 'estado' && 'Seleccione un estado'}
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

        <div className="guarantees-table-container">
          {filteredGuarantees.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Código de Garantía</th>
                  <th>Fecha de Recepción</th>
                  <th>Cliente</th>
                  <th>Tienda</th>
                  <th>Producto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuarantees.map(guarantee => (
                  <tr key={guarantee.id}>
                    <td>{guarantee.codigo}</td>
                    <td>{guarantee.fechaRecepcion}</td>
                    <td>{guarantee.nombreCliente}</td>
                    <td>{guarantee.tienda}</td>
                    <td>{guarantee.producto}</td>
                    <td><span className={`status-${guarantee.estado.replace(/\s+/g, '-').toLowerCase()}`}>{guarantee.estado}</span></td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => handleViewDetails(guarantee.id)}
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
      <GuaranteeDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        guarantee={selectedGuarantee}
        onUpdateGuarantee={handleUpdateGuaranteeInList}
      />

    </LayoutBaseTechServ>
  );
};

export default GuaranteesList;