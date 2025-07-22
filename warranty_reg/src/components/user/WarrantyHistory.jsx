import React, { useState, useEffect } from 'react';
import LayoutBaseUser from '../base/LayoutBaseUser';
import '../../styles/user/warrantyHistory.css';

// --- Data de ejemplo para Historial de Warranties (asegurando el campo usosRegistrados) ---
const mockHistoryWarranties = [
  {
    id: 'H001',
    codigo: 'ABC-123-X',
    fechaCompra: '2024-01-15',
    tienda: 'ElectroMega',
    marcaProducto: 'Lavadora',
    modeloProducto: 'XYZ',
    usosRegistrados: 0,
  },
  {
    id: 'H002',
    codigo: 'DEF-456-Y',
    fechaCompra: '2025-03-01',
    tienda: 'TecnoGlobal',
    marcaProducto: 'Televisor',
    modeloProducto: 'QLED',
    usosRegistrados: 1,
  },
  {
    id: 'H003',
    codigo: 'GHI-789-Z',
    fechaCompra: '2024-11-20',
    tienda: 'MegaHogar',
    marcaProducto: 'Refrigerador',
    modeloProducto: 'Cool',
    usosRegistrados: 2,
  },
  {
    id: 'H004',
    codigo: 'JKL-012-A',
    fechaCompra: '2024-07-01',
    tienda: 'ElectroMega',
    marcaProducto: 'Microondas',
    modeloProducto: 'Smart',
    usosRegistrados: 0,
  },
  {
    id: 'H005',
    codigo: 'MNO-345-B',
    fechaCompra: '2025-01-01',
    tienda: 'TecnoGlobal',
    marcaProducto: 'Aspiradora',
    modeloProducto: 'Robótica',
    usosRegistrados: 0,
  },
];

const WarrantyHistory = ({ userFirstName }) => {
  const [filterStatus, setFilterStatus] = useState('');
  const [filteredHistoryWarranties, setFilteredHistoryWarranties] = useState([]); 

  const getWarrantyStatus = (fechaCompra) => {
    const purchaseDate = new Date(fechaCompra);
    const expirationDate = new Date(purchaseDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    expirationDate.setHours(0, 0, 0, 0);

    const timeLeftMs = expirationDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeLeftMs / (1000 * 60 * 60 * 24));

    const status = daysLeft > 0 ? 'Disponible' : 'Vencida';

    return { expirationDate: expirationDate.toISOString().split('T')[0], daysLeft, status };
  };

  useEffect(() => {
    let currentHistoryWarranties = [...mockHistoryWarranties];

    if (filterStatus) {
      currentHistoryWarranties = currentHistoryWarranties.filter(warranty => {
        const { status } = getWarrantyStatus(warranty.fechaCompra);
        return status === filterStatus;
      });
    }

    // Ordenar de más reciente a más antigua
    currentHistoryWarranties.sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra)); 

    setFilteredHistoryWarranties(currentHistoryWarranties);
  }, [filterStatus]);

  return (
    <LayoutBaseUser activePage="history">
      <div className="warranty-list-container">
        <div className="warranty-title-section">
          <h2>Historial de Garantías</h2>
        </div>

        <div className="warranty-filters-history-container">
          <select
            className="warranty-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Disponible">Disponible</option>
            <option value="Vencida">Vencida</option>
          </select>
        </div>

        <div className="warranty-table-container">
          {filteredHistoryWarranties.length > 0 ? (
            <table class="warranty-table">
              <thead>
                <tr>
                  <th>Código de Garantía</th>
                  <th>Fecha de Compra</th>
                  <th>Tienda</th>
                  <th>Producto</th>
                  <th>Fecha de Vencimiento</th>
                  <th>Días Disponibles</th>
                  <th>Usos Registrados</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistoryWarranties.map(warranty => {
                  const { expirationDate, daysLeft, status } = getWarrantyStatus(warranty.fechaCompra); // Renombrado
                  return (
                    <tr key={warranty.id}>
                      <td>{warranty.codigo}</td>
                      <td>{warranty.fechaCompra}</td>
                      <td>{warranty.tienda}</td>
                      <td>{warranty.marcaProducto} - {warranty.modeloProducto}</td>
                      <td>{expirationDate}</td>
                      <td>{daysLeft}</td>
                      <td>{warranty.usosRegistrados}</td>
                      <td>
                        <span className={`status-${status === 'Disponible' ? 'abierto' : 'cerrado'}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="no-results">No se encontraron garantías en el historial.</p>
          )}
        </div>
      </div>
    </LayoutBaseUser>
  );
};

export default WarrantyHistory;