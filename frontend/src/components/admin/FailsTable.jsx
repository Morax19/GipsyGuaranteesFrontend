import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import eye from '../../assets/IMG/ojo.png';
import editIcon from '../../assets/IMG/edit.png';
import '../../styles/admin/failsTable.css';
import LayoutBaseAdmin from '../base/LayoutBaseAdmin';
import UserFormModal from './UserFormModal';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

const failsTable = () => {

  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      alert('Por favor, inicie sesión para acceder a esta página.');
      navigate('/admin/login');
      return null;
    }
  }, [navigate]);

  const [allIssues, setAllIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [issueToEdit, setIssueToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'IssueId', direction: 'ascending' });

  const fetchIssues = async () => {
    try{
      const response = await fetchWithAuth(
        `${apiUrl}/api/technicalServiceGetIssue/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json()

      if (response.ok) {
        setAllIssues(data);
      } else {
        console.error(data.error);
      }
    } catch {
      console.error('Error connecting to server');
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
        sortConfig.key === key &&
        sortConfig.direction === 'ascending'
    ) {
        direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    let currentIssues = [...allIssues];

    if (searchTerm) {
      currentIssues = currentIssues.filter(issue =>
        issue.IssueDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    currentIssues.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  }, [searchTerm, allIssues, sortConfig]);

  const handleAddIssue = () => {
    setIssueToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditIssue = (IssueId) => {
    const issue = allIssues.find(issue => issue.IssueId === IssueId);
    setIssueToEdit(user);
    setIsModalOpen(true);
  };

  const handleSaveIssue = (issueData, isEditing) => {
    if (isEditing) {
      setAllIssues(prevIssues => prevIssues.map(issue => (issue.IssueId === issueData.IssueId ? issueData : issue)));
      console.log('Fallo actualizado:', issueData);
    } else {
      const newIssueId = Math.max(...allIssues.map(issue => issue.IssueId)) + 1;
      const newIssue = { ...issueData, IssueId: newIssueId };
      setAllIssues(prevIssues => [...prevIssues, newIssue]);
      console.log('Nuevo fallo agregado:', newIssue);
    }
    setIsModalOpen(false);
    setIssueToEdit(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIssueToEdit(null);
    fetchIssues();
  };

  return (
    <LayoutBaseAdmin activePage="failsTable">
      <div className="users-list-container">
        <div className="title-section">
          <h2>Gestión de Fallos de Productos</h2>
        </div>

        <div className="filters-and-search-container">
          <div className="filters-and-search">
            <input
              type="text"
              placeholder="Buscar por Descripción..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="add-user-button-container">
            <button className="add-user-button-admin" onClick={handleAddUser}>
              + Agregar Fallo
            </button>
          </div>
        </div>

        <div className="users-table-container">
          {(
            <table className="users-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('IssueId')}>ID</th>
                  <th>Descripción del Fallo</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map(i => (
                  <tr key={i.IssueId}>
                    <td>{i.IssueId}</td>
                    <td>{i.IssueDescription}</td>
                </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-results">No se encontraron fallos.</p>
          )}
        </div>
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        issueToEdit={issueToEdit}
        onSave={handleSaveIssue}
        onReload={fetchIssues}
      />
    </LayoutBaseAdmin>
  );
};

export default failsTable;