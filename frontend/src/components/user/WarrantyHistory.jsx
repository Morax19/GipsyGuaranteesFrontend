import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import LayoutBaseUser from '../base/LayoutBaseUser';
import '../../styles/user/warrantyHistory.css';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

// Historial real de garantías del usuario
const WarrantyHistory = () => {
  const {user_id, user_first_name, email_address, role} = getCurrentUserInfo();
  const [historyWarranties, setHistoryWarranties] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filteredHistoryWarranties, setFilteredHistoryWarranties] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetchWithAuth(
          `${apiUrl}/api/warrantyHistory/?userID=${user_id}`,
          {
            method: 'GET',
          }
        );
        const data = await response.json();
        if (response.ok) {
          setHistoryWarranties(data);
          
        } else {
          console.log(data.error);
          alert(data.warning)
        }
      } catch {
        console.log('Error de conexión con el servidor');
      }
    }
    fetchHistory();
  }, []);


  // Accept the whole warranty object so we can inspect brand and purchaseDate
  const getWarrantyStatus = (warranty) => {
    const purchaseDate = new Date(warranty.purchaseDate);
    const expirationDate = new Date(purchaseDate);

    // Determine brand (handle variations in property names). If brand matches certain
    // manufacturers, warranty is 2 years, otherwise 1 year.
    const brand = warranty.itemBrand || warranty.brand || warranty.ProductBrand || '';
    const twoYearBrands = ['Remington', 'Black & Decker'];
    if (twoYearBrands.includes(brand)) {
      expirationDate.setFullYear(expirationDate.getFullYear() + 2);
    } else {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expirationDate.setHours(0, 0, 0, 0);

    const timeLeftMs = expirationDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeLeftMs / (1000 * 60 * 60 * 24));

    const status = daysLeft > 0 ? 'Vigente' : 'Vencida';

    return { expirationDate: expirationDate.toISOString().split('T')[0], daysLeft, status };
  };

  useEffect(() => {
    let currentHistoryWarranties = [...historyWarranties];

    if (filterStatus) {
      currentHistoryWarranties = currentHistoryWarranties.filter(warranty => {
        const { status } = getWarrantyStatus(warranty);
        return status === filterStatus;
      });
    }

    // Ordenar de más reciente a más antigua (use purchaseDate from the API)
    currentHistoryWarranties.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

    setFilteredHistoryWarranties(currentHistoryWarranties);
  }, [filterStatus, historyWarranties]);

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
            <option value="Vigente">Vigente</option>
            <option value="Vencida">Vencida</option>
          </select>
        </div>

        <div className="warranty-table-container">
          {filteredHistoryWarranties.length > 0 ? (
            <table className="warranty-table">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Fecha de Registro</th>
                  <th>Fecha de Compra</th>
                  <th>Tienda</th>
                  <th>Producto</th>
                  <th>Número de usos</th>
                  <th>Fecha de Vencimiento</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistoryWarranties.map(warranty => {
                  const { expirationDate, daysLeft, status } = getWarrantyStatus(warranty);
                  return (
                    <tr key={warranty.WarrantyNumber}>
                      <td>{warranty.WarrantyNumber}</td>
                      <td>{warranty.registrationDate}</td>
                      <td>{warranty.purchaseDate}</td>
                      <td>{warranty.companyName}</td>
                      <td>{warranty.ProductName}</td>
                      <td>{warranty.usedCount}</td>
                      <td>{expirationDate}</td>
                      <td>
                        <span className={`status-${status === 'Vigente' ? 'Abierto' : 'Cerrado'}`}>
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
}

export default WarrantyHistory;