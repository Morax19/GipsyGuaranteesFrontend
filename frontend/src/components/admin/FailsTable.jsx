import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import editIcon from '../../assets/IMG/edit.png';
import '../../styles/admin/failsTable.css';
import LayoutBaseAdmin from '../base/LayoutBaseAdmin';
import FailsFormModal from './FailsFormModal';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

const FailsTable = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      alert('Por favor, inicie sesión para acceder a esta página.');
      navigate('/admin/login');
    }
  }, [navigate]);

  const [allIssues, setAllIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [issueToEdit, setIssueToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchIssues = async () => {
    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/technicalServiceGetIssue/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();

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

  const filteredIssues = useMemo(() => {
    let currentIssues = [...allIssues];
    if (searchTerm) {
      currentIssues = currentIssues.filter(issue =>
        issue.IssueDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return currentIssues;
  }, [allIssues, searchTerm]);

  const handleAddIssue = () => {
    setIssueToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditIssue = (IssueId) => {
    const issue = allIssues.find(issue => issue.IssueId === IssueId);
    setIssueToEdit(issue);
    setIsModalOpen(true);
  };

  const handleSaveIssue = (issueData, isEditing) => {
    if (isEditing) {
      setAllIssues(prevIssues => prevIssues.map(issue => (issue.IssueId === issueData.IssueId ? issueData : issue)));
    } else {
      const newIssueId = Math.max(...allIssues.map(issue => issue.IssueId)) + 1;
      const newIssue = { ...issueData, IssueId: newIssueId };
      setAllIssues(prevIssues => [...prevIssues, newIssue]);
    }
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
          <h2>Gestión de Fallas de Productos</h2>
        </div>

        <div className="filters-and-search-container-admin">
          <div className="filters-and-search-admin">
            <input
              type="text"
              placeholder="Buscar por Descripción..."
              className="search-input-admin"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="add-user-button-container">
            <button className="add-user-button-admin" onClick={handleAddIssue}>
              + Agregar Falla
            </button>
          </div>
        </div>

        <div className="users-table-container">
          {filteredIssues.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descripción de la Falla</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map(i => (
                  <tr key={i.IssueId}>
                    <td>{i.IssueId}</td>
                    <td>{i.IssueDescription}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEditIssue(i.IssueId)}
                        title="Editar Falla"
                       >
                        <img src={editIcon} alt="Editar" />
                      </button>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-results">No se encontraron fallas.</p>
          )}
        </div>
      </div>

      <FailsFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveIssue}
        issueToEdit={issueToEdit}
      />
    </LayoutBaseAdmin>
  );
};

export default FailsTable;