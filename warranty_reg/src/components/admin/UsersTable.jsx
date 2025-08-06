import React, { useState, useEffect } from 'react';
import eye from '../../assets/IMG/ojo.png';
import editIcon from '../../assets/IMG/edit.png';
import '../../styles/admin/usersTable.css';
import LayoutBaseAdmin from '../base/LayoutBaseAdmin';

// Datos de ejemplo para la tabla de Users
const mockUsers = [
  {
    id_usuario: 1,
    User: 'johndoe',
    Password: 'password123',
    registrationDate: '2024-08-01',
    CustomerID: '001',
    roleID: 'Administrador'
  },
  {
    id_usuario: 2,
    User: 'janedoe',
    Password: 'securepass',
    registrationDate: '2024-08-05',
    CustomerID: '002',
    roleID: 'Servicio Técnico'
  },
  {
    id_usuario: 3,
    User: 'petersmith',
    Password: 'strongpassword',
    registrationDate: '2023-07-25',
    CustomerID: '003',
    roleID: 'Cliente'
  },
  {
    id_usuario: 4,
    User: 'maryjones',
    Password: 'anotherpass',
    registrationDate: '2024-06-15',
    CustomerID: '004',
    roleID: 'Cliente'
  },
];

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [primaryFilter, setPrimaryFilter] = useState('');
  const [secondaryFilter, setSecondaryFilter] = useState('');
  const [secondaryFilterOptions, setSecondaryFilterOptions] = useState([]);
  const [allUsers, setAllUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [showPasswordFor, setShowPasswordFor] = useState(null);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

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

    if (!primaryFilter) {
      currentUsers.sort((a, b) => new Date(a.registrationDate) - new Date(b.registrationDate));
    }

    setFilteredUsers(currentUsers);
  }, [searchTerm, primaryFilter, secondaryFilter, allUsers]);

  const handleTogglePassword = (userid_usuario) => {
    setShowPasswordFor(showPasswordFor === userid_usuario ? null : userid_usuario);
  };

  const handleAddUser = () => {
    console.log("Add User button clicked!");
  };

  const handleEditUser = (userid_usuario) => {
    console.log(`Edit user with id_usuario: ${userid_usuario}`);
  };

  return (
    <LayoutBaseAdmin activePage="usersList">
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
              className="filter-select"
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
                className="filter-select"
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
                  <th>ID</th>
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
    </LayoutBaseAdmin>
  );
};

export default UsersTable;