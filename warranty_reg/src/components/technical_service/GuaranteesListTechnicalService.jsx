import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../fetchWithAuth';
import { useSession } from '../../SessionContext';
import LayoutBaseTechServ from '../base/LayoutBaseTechServ';
import eye from '../../assets/IMG/ojo.png';
import '../../styles/technical_service/guaranteesList.css';


const mockGuarantees = [
  {
    id: 'G001',
    codigo: 'ABC-123-X',
    fechaRecepcion: '2024-07-01', // Julio
    nombreCliente: 'Juan Pérez',
    tienda: 'ElectroMega',
    producto: 'Lavadora XYZ',
    estado: 'Abierto',
  },
  {
    id: 'G002',
    codigo: 'DEF-456-Y',
    fechaRecepcion: '2024-07-05', // Julio
    nombreCliente: 'María López',
    tienda: 'TecnoGlobal',
    producto: 'Televisor QLED',
    estado: 'En Revisión',
  },
  {
    id: 'G003',
    codigo: 'GHI-789-Z',
    fechaRecepcion: '2024-06-10', // Junio
    nombreCliente: 'Carlos García',
    tienda: 'MegaHogar',
    producto: 'Refrigerador Cool',
    estado: 'Abierto',
  },
  {
    id: 'G004',
    codigo: 'JKL-012-A',
    fechaRecepcion: '2024-08-12', // Agosto
    nombreCliente: 'Ana Fernández',
    tienda: 'ElectroMega',
    producto: 'Microondas Smart',
    estado: 'Pendiente',
  },
  {
    id: 'G005',
    codigo: 'MNO-345-B',
    fechaRecepcion: '2024-07-15', // Julio
    nombreCliente: 'Luis Martínez',
    tienda: 'TecnoGlobal',
    producto: 'Aspiradora Robótica',
    estado: 'Abierto',
  },
  {
    id: 'G006',
    codigo: 'PQR-678-C',
    fechaRecepcion: '2024-08-20', // Agosto
    nombreCliente: 'Sofía Díaz',
    tienda: 'MegaHogar',
    producto: 'Horno Eléctrico',
    estado: 'Cerrado',
  },
];

const GuaranteesList = ({ userFirstName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [primaryFilter, setPrimaryFilter] = useState(''); // Renombrado de 'filterBy' a 'primaryFilter'
  const [secondaryFilter, setSecondaryFilter] = useState(''); // Nuevo estado para el filtro secundario
  const [secondaryFilterOptions, setSecondaryFilterOptions] = useState([]); // Opciones dinámicas para el filtro 2
  const [filteredGuarantees, setFilteredGuarantees] = useState(mockGuarantees);

  // Mapeo de meses para el filtro de fecha
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Efecto para actualizar las opciones del filtro secundario y los filtros principales
  useEffect(() => {
    let currentGuarantees = mockGuarantees;

    // --- Lógica para poblar opciones del filtro secundario ---
    let newSecondaryOptions = [];
    if (primaryFilter === 'fecha') {
      // Extrae los meses únicos de las fechas de recepción
      const months = [...new Set(mockGuarantees.map(g => new Date(g.fechaRecepcion).getMonth()))]
        .sort((a, b) => a - b) // Ordena por número de mes
        .map(monthNum => ({ value: monthNum, label: monthNames[monthNum] }));
      newSecondaryOptions = months;
    } else if (primaryFilter === 'producto') {
      // Extrae los productos únicos
      const products = [...new Set(mockGuarantees.map(g => g.producto))].sort();
      newSecondaryOptions = products.map(p => ({ value: p, label: p }));
    } else if (primaryFilter === 'tienda') {
      // Extrae las tiendas únicas
      const stores = [...new Set(mockGuarantees.map(g => g.tienda))].sort();
      newSecondaryOptions = stores.map(s => ({ value: s, label: s }));
    }
    setSecondaryFilterOptions(newSecondaryOptions);
    setSecondaryFilter(''); // Reiniciar el filtro secundario cuando cambia el primario

    // --- Aplicar Búsqueda por código de garantía ---
    if (searchTerm) {
      currentGuarantees = currentGuarantees.filter(guarantee =>
        guarantee.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // --- Aplicar Filtro Primario y Secundario ---
    if (primaryFilter) {
      if (primaryFilter === 'fecha' && secondaryFilter !== '') {
        currentGuarantees = currentGuarantees.filter(guarantee =>
          new Date(guarantee.fechaRecepcion).getMonth() === parseInt(secondaryFilter)
        );
      } else if (primaryFilter === 'producto' && secondaryFilter !== '') {
        currentGuarantees = currentGuarantees.filter(guarantee =>
          guarantee.producto === secondaryFilter
        );
      } else if (primaryFilter === 'tienda' && secondaryFilter !== '') {
        currentGuarantees = currentGuarantees.filter(guarantee =>
          guarantee.tienda === secondaryFilter
        );
      }
      // Si solo hay filtro primario seleccionado y no secundario, o si el secundario es solo para ordenar
      // Aplicar ordenación basada en el filtro primario
      if (primaryFilter === 'producto') {
        currentGuarantees.sort((a, b) => a.producto.localeCompare(b.producto));
      } else if (primaryFilter === 'fecha') {
        currentGuarantees.sort((a, b) => new Date(a.fechaRecepcion) - new Date(b.fechaRecepcion));
      } else if (primaryFilter === 'tienda') {
        currentGuarantees.sort((a, b) => a.tienda.localeCompare(b.tienda));
      }
    }

    setFilteredGuarantees(currentGuarantees);
  }, [searchTerm, primaryFilter, secondaryFilter]); // Dependencias para re-ejecutar el efecto


  // Función para manejar el clic en el ícono de detalles
  const handleViewDetails = (guaranteeId) => {
    console.log('Ver detalles de la garantía:', guaranteeId);
    // Aquí puedes redirigir a una página de detalles de garantía o abrir un modal
  };

  return (
    <LayoutBaseTechServ activePage="guaranteesList">
      <div className="guarantees-list-container">
        <div className="title-section">
          <h2>Casos Abiertos de Garantías</h2>
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
          </select>

          {/* Nuevo select para el filtro secundario, solo visible si se elige un filtro primario */}
          {primaryFilter && secondaryFilterOptions.length > 0 && (
            <select
              className="filter-select" // Nueva clase para estilos específicos
              value={secondaryFilter}
              onChange={(e) => setSecondaryFilter(e.target.value)}
              disabled={secondaryFilterOptions.length === 0} // Deshabilitado si no hay opciones
            >
              <option value="">
                {primaryFilter === 'fecha' && 'Seleccione un mes'}
                {primaryFilter === 'producto' && 'Seleccione un producto'}
                {primaryFilter === 'tienda' && 'Seleccione una tienda'}
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
    </LayoutBaseTechServ>
  );
};

export default GuaranteesList;