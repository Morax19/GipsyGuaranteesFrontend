import React, { useState, useEffect } from 'react';
import eye from '../../assets/IMG/ojo.png';
import editIcon from '../../assets/IMG/edit.png';
import '../../styles/admin/usersTable.css';
import LayoutBaseAdmin from '../base/LayoutBaseAdmin';
import UserFormModal from './UserFormModal';
import { fetchWithAuth } from '../../fetchWithAuth';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : process.env.VITE_API_BASE_URL_PROD;

// Users will be fetched from backend

const UsersTable = () => {
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetchWithAuth(
          `${apiUrl}/api/getUserAdmin/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('session_token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        if (response.ok) {
          setAllUsers(data);
          setFilteredUsers(data);
        } else {
          console.error(data.message || 'Error fetching users');
        }
      } catch {
        console.error('Error connecting to server');
      }
    }
    fetchUsers();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [primaryFilter, setPrimaryFilter] = useState('');
  const [secondaryFilter, setSecondaryFilter] = useState('');
  const [secondaryFilterOptions, setSecondaryFilterOptions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showPasswordFor, setShowPasswordFor] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id_usuario', direction: 'ascending' });

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

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
    let currentUsers = [...allUsers];

    if (searchTerm) {
      currentUsers = currentUsers.filter(user =>
        user.User.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    let newSecondaryOptions = [];
    if (primaryFilter === 'year') {
      const years = [...new Set(currentUsers.map(u => new Date(u.registrationDate).getFullYear()))].sort((a, b) => b - a);
      newSecondaryOptions = years.map(year => ({ value: String(year), label: String(year) }));
    } else if (primaryFilter === 'month') {
      const months = [...new Set(currentUsers.map(u => new Date(u.registrationDate).getMonth()))]
        .sort((a, b) => a - b)
        .map(monthNum => ({ value: String(monthNum), label: monthNames[monthNum] }));
      newSecondaryOptions = months;
    } else if (primaryFilter === 'role') {
      const roles = [...new Set(currentUsers.map(u => u.roleID))].sort();
      newSecondaryOptions = roles.map(role => ({ value: role, label: role }));
    }
    setSecondaryFilterOptions(newSecondaryOptions);

    if (primaryFilter !== '' && secondaryFilter !== '' && !newSecondaryOptions.some(opt => opt.value === secondaryFilter)) {
      setSecondaryFilter('');
    } else if (primaryFilter === '' && secondaryFilter !== '') {
      setSecondaryFilter('');
    }

    if (primaryFilter && secondaryFilter !== '') {
      if (primaryFilter === 'year') {
        currentUsers = currentUsers.filter(user =>
          String(new Date(user.registrationDate).getFullYear()) === secondaryFilter
        );
      } else if (primaryFilter === 'month') {
        currentUsers = currentUsers.filter(user =>
          String(new Date(user.registrationDate).getMonth()) === secondaryFilter
        );
      } else if (primaryFilter === 'role') {
        currentUsers = currentUsers.filter(user =>
          user.roleID === secondaryFilter
        );
      }
    }
    
    currentUsers.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredUsers(currentUsers);
  }, [searchTerm, primaryFilter, secondaryFilter, allUsers, sortConfig]);

  const handleTogglePassword = (id_usuario) => {
    setShowPasswordFor(showPasswordFor === id_usuario ? null : id_usuario);
  };

  const handleAddUser = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (id_usuario) => {
    const user = allUsers.find(u => u.id_usuario === id_usuario);
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (userData, isEditing) => {
    if (isEditing) {
      setAllUsers(prevUsers => prevUsers.map(u => (u.id_usuario === userData.id_usuario ? userData : u)));
      console.log('Usuario actualizado:', userData);
    } else {
      const newUserId = Math.max(...allUsers.map(u => u.id_usuario)) + 1;
      const newUser = { ...userData, id_usuario: newUserId };
      setAllUsers(prevUsers => [...prevUsers, newUser]);
      console.log('Nuevo usuario agregado:', newUser);
    }
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  return (
    <LayoutBaseAdmin activePage="usersTable">
      <div className="users-list-container">
        <div className="title-section">
          <h2>Gestión de Usuarios</h2>
        </div>

        <div className="filters-and-search-container">
          <div className="filters-and-search">
            <input
              type="text"
              placeholder="Buscar por Usuario..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select-admin"
              value={primaryFilter}
              onChange={(e) => {
                setPrimaryFilter(e.target.value);
                setSecondaryFilter('');
              }}
            >
              <option value="">Filtrar por...</option>
              <option value="year">Año de Registro</option>
              <option value="month">Mes de Registro</option>
              <option value="role">Rol Asignado</option>
            </select>
            {primaryFilter && secondaryFilterOptions.length > 0 && (
              <select
                className="filter-select-admin"
                value={secondaryFilter}
                onChange={(e) => setSecondaryFilter(e.target.value)}
                disabled={secondaryFilterOptions.length === 0}
              >
                <option value="">
                  {primaryFilter === 'year' && 'Seleccione un año'}
                  {primaryFilter === 'month' && 'Seleccione un mes'}
                  {primaryFilter === 'role' && 'Seleccione un rol'}
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
          <div className="add-user-button-container">
            <button className="add-user-button-admin" onClick={handleAddUser}>
              + Agregar Usuario
            </button>
          </div>
        </div>

        <div className="users-table-container">
          {filteredUsers.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('id_usuario')}>ID</th>
                  <th>Usuario</th>
                  <th>Contraseña</th>
                  <th>Fecha de Registro</th>
                  <th>ID de Cliente</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id_usuario}>
                    <td>{user.id_usuario}</td>
                    <td>{user.User}</td>
                    <td className="password-cell">
                      {showPasswordFor === user.id_usuario ? user.Password : '********'}
                      <button
                        className="password-toggle-button"
                        onClick={() => handleTogglePassword(user.id_usuario)}
                        title={showPasswordFor === user.id_usuario ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        <img src={eye} alt="Toggle password visibility" />
                      </button>
                    </td>
                    <td>{user.registrationDate}</td>
                    <td>{user.CustomerID}</td>
                    <td><span className={`role-${user.roleID.toLowerCase().replace(/\s+/g, '-')}`}>{user.roleID}</span></td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEditUser(user.id_usuario)}
                        title="Editar Usuario"
                      >
                        <img src={editIcon} alt="Editar" />
                      </button>
                    </td>
                </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-results">No se encontraron Usuarios.</p>
          )}
        </div>
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userToEdit={userToEdit}
        onSave={handleSaveUser}
      />
      
    </LayoutBaseAdmin>
  );
};

export default UsersTable;