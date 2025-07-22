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
  {
    id: 'G007',
    codigo: 'STU-901-D',
    fechaRecepcion: '2024-07-22', // Julio
    nombreCliente: 'Pedro Gómez',
    tienda: 'ElectroMega',
    producto: 'Cafetera Express',
    estado: 'Finalizado', // Nuevo estado de ejemplo
  },
];

const GuaranteesList = ({ userFirstName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [primaryFilter, setPrimaryFilter] = useState('');
  const [secondaryFilter, setSecondaryFilter] = useState('');
  const [secondaryFilterOptions, setSecondaryFilterOptions] = useState([]);
  const [filteredGuarantees, setFilteredGuarantees] = useState(mockGuarantees);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  useEffect(() => {
    let currentGuarantees = mockGuarantees;

    // 1. Aplicar Búsqueda por código de garantía (siempre primero)
    if (searchTerm) {
      currentGuarantees = currentGuarantees.filter(guarantee =>
        guarantee.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Lógica para poblar opciones del filtro secundario (basado en el primaryFilter actual)
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
    } else if (primaryFilter === 'estado') { // <-- NUEVA LÓGICA: para el filtro por estado
      const statuses = [...new Set(currentGuarantees.map(g => g.estado))].sort();
      newSecondaryOptions = statuses.map(s => ({ value: s, label: s }));
    }
    setSecondaryFilterOptions(newSecondaryOptions);

    // Reiniciar secondaryFilter si el primaryFilter cambió o el valor actual no es válido
    if (primaryFilter !== '' && secondaryFilter !== '' && !newSecondaryOptions.some(opt => opt.value === secondaryFilter)) {
        setSecondaryFilter('');
    } else if (primaryFilter === '' && secondaryFilter !== '') { // Si el primaryFilter se resetea, resetear secondary
        setSecondaryFilter('');
    }


    // 3. Aplicar Filtro Secundario (si primaryFilter y secondaryFilter están seleccionados)
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
      } else if (primaryFilter === 'estado') { // <-- NUEVA LÓGICA: para filtrar por estado
        currentGuarantees = currentGuarantees.filter(guarantee =>
          guarantee.estado === secondaryFilter
        );
      }
    }

    // 4. Aplicar Ordenación (siempre después del filtrado)
    // Nota: la ordenación por estado podría no ser alfabética si tienes un orden específico deseado (ej. Abierto, En Revisión, Cerrado)
    // Para ordenar por estado, necesitarías una lógica de ordenación personalizada si no es alfabética
    if (primaryFilter === 'producto') {
      currentGuarantees.sort((a, b) => a.producto.localeCompare(b.producto));
    } else if (primaryFilter === 'fecha') {
      currentGuarantees.sort((a, b) => new Date(a.fechaRecepcion) - new Date(b.fechaRecepcion));
    } else if (primaryFilter === 'tienda') {
      currentGuarantees.sort((a, b) => a.tienda.localeCompare(b.tienda));
    } else if (primaryFilter === 'estado') { // <-- Lógica de ordenación para estado (alfabética por defecto)
        currentGuarantees.sort((a, b) => a.estado.localeCompare(b.estado));
        // Si necesitas un orden específico (ej: Abierto, En Revisión, Cerrado, Finalizado),
        // definirías un array de orden y usarías sus índices:
        /*
        const estadoOrder = ['Abierto', 'En Revisión', 'Pendiente', 'Cerrado', 'Finalizado'];
        currentGuarantees.sort((a, b) => estadoOrder.indexOf(a.estado) - estadoOrder.indexOf(b.estado));
        */
    }

    setFilteredGuarantees(currentGuarantees);
  }, [searchTerm, primaryFilter, secondaryFilter]);


  const handleViewDetails = (guaranteeId) => {
    console.log('Ver detalles de la garantía:', guaranteeId);
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
            <option value="estado">Estado</option> {/* <-- NUEVA OPCIÓN: Estado */}
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
                {primaryFilter === 'estado' && 'Seleccione un estado'} {/* <-- NUEVO: texto para estado */}
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