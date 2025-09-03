import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import { jwtDecode } from 'jwt-decode';
import LayoutBaseUser from '../base/LayoutBaseUser';
import '../../styles/user/warrantyHistory.css';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

// Historial real de garantías del usuario
const WarrantyHistory = () => {

  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      alert('Por favor, inicie sesión para acceder a esta página.');
      navigate('/user/login');
      return null;
    }
  }, [navigate]);

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


  const getWarrantyStatus = (fechaCompra) => {
    const purchaseDate = new Date(fechaCompra);
    const expirationDate = new Date(purchaseDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    
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
        const { status } = getWarrantyStatus(warranty.purchaseDate);
        return status === filterStatus;
      });
    }

    // Ordenar de más reciente a más antigua
    currentHistoryWarranties.sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra)); 

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
                  <th>Tienda</th>
                  <th>Producto</th>
                  <th>Número de usos</th>
                  <th>Fecha de Vencimiento</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistoryWarranties.map(warranty => {
                  const { expirationDate, daysLeft, status } = getWarrantyStatus(warranty.purchaseDate);
                  return (
                    <tr key={warranty.WarrantyNumber}>
                      <td>{warranty.WarrantyNumber}</td>
                      <td>{warranty.registrationDate}</td>
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