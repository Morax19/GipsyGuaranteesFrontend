import React, { useState, useEffect } from 'react';
import editIcon from '../../assets/IMG/edit.png';
import '../../styles/admin/usersTable.css';
import LayoutBaseAdmin from '../base/LayoutBaseAdmin';
import BranchFormModal from './BranchFormModal';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

// Datos de ejemplo para la tabla de Branches
const mockBranches = [
  {
    branchID: 101,
    customerID: 1,
    isRetail: 1,
    RIFtype: 'J',
    RIF: 123456789,
    companyName: 'Tech Solutions Inc.',
    address: 'Las Mercedes, Caracas',
    branchDescription: 'Sucursal principal de ventas y soporte'
  },
  {
    branchID: 102,
    customerID: 2,
    isRetail: 0,
    RIFtype: 'V',
    RIF: 987654321,
    companyName: 'Innovate S.A.',
    address: 'Avenida Libertador, Edificio Innova, Valencia',
    branchDescription: 'Sucursal de desarrollo de software'
  },
  {
    branchID: 103,
    customerID: 1,
    isRetail: 1,
    RIFtype: 'J',
    RIF: 112233445,
    companyName: 'Tech Solutions Inc.',
    address: 'Av. Principal, Maracay',
    branchDescription: 'Sucursal de soporte técnico'
  },
  {
    branchID: 104,
    customerID: 3,
    isRetail: 0,
    RIFtype: 'G',
    RIF: 445566778,
    companyName: 'Global Distributors C.A.',
    address: 'Carretera Nacional, Barquisimeto',
    branchDescription: 'Centro de distribución'
  },
];

const BranchesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRetailFilter, setIsRetailFilter] = useState(''); // Nuevo estado para el filtro
  const [allBranches, setAllBranches] = useState(mockBranches);
  const [filteredBranches, setFilteredBranches] = useState(mockBranches);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branchToEdit, setBranchToEdit] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'branchID', direction: 'ascending' });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    let currentBranches = [...allBranches];

    // Búsqueda por nombre de compañía
    if (searchTerm) {
      currentBranches = currentBranches.filter(branch =>
        branch.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar el nuevo filtro de minorista/mayorista
    if (isRetailFilter !== '') {
        const filterValue = isRetailFilter === 'retail' ? 1 : 0;
        currentBranches = currentBranches.filter(branch =>
            branch.isRetail === filterValue
        );
    }

    // Ordenamiento por nombre de compañía por defecto, pero se puede cambiar con la tabla
    currentBranches.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredBranches(currentBranches);
  }, [searchTerm, isRetailFilter, allBranches, sortConfig]); // Añadir isRetailFilter a las dependencias

  const handleAddBranch = () => {
    setBranchToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditBranch = (branchID) => {
    const branch = allBranches.find(b => b.branchID === branchID);
    setBranchToEdit(branch);
    setIsModalOpen(true);
  };

  const handleSaveBranch = (branchData, isEditing) => {
    if (isEditing) {
      setAllBranches(prevBranches => prevBranches.map(b => (b.branchID === branchData.branchID ? branchData : b)));
      console.log('Sucursal actualizada:', branchData);
    } else {
      const newBranchId = Math.max(...allBranches.map(b => b.branchID)) + 1;
      const newBranch = { ...branchData, branchID: newBranchId };
      setAllBranches(prevBranches => [...prevBranches, newBranch]);
      console.log('Nueva sucursal agregada:', newBranch);
    }
    setIsModalOpen(false);
    setBranchToEdit(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBranchToEdit(null);
  };

  return (
    <LayoutBaseAdmin activePage="branchesTable">
      <div className="users-list-container">
        <div className="title-section">
          <h2>Gestión de Sucursales</h2>
        </div>

        <div className="filters-and-search-container">
          <div className="filters-and-search">
            <input
              type="text"
              placeholder="Buscar por Nombre de Compañía..."
              className="search-input-admin"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Nuevo select para el filtro de tipo de tienda */}
            <select
              className="filter-select-admin"
              value={isRetailFilter}
              onChange={(e) => setIsRetailFilter(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="retail">Minorista</option>
              <option value="wholesale">Mayorista</option>
            </select>
          </div>
          <div className="add-user-button-container">
            <button className="add-user-button-admin" onClick={handleAddBranch}>
              + Agregar Sucursal
            </button>
          </div>
        </div>

        <div className="users-table-container">
          {filteredBranches.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('branchID')}>ID de Sucursal</th>
                  <th>ID de Cliente</th>
                  <th>Minorista</th>
                  <th>Tipo RIF</th>
                  <th>RIF</th>
                  <th onClick={() => requestSort('companyName')}>Nombre de Compañía</th>
                  <th>Dirección</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredBranches.map(branch => (
                  <tr key={branch.branchID}>
                    <td>{branch.branchID}</td>
                    <td>{branch.customerID}</td>
                    <td>{branch.isRetail ? 'Sí' : 'No'}</td>
                    <td>{branch.RIFtype}</td>
                    <td>{branch.RIF}</td>
                    <td>{branch.companyName}</td>
                    <td>{branch.address}</td>
                    <td>{branch.branchDescription}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEditBranch(branch.branchID)}
                        title="Editar Sucursal"
                      >
                        <img src={editIcon} alt="Editar" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-results">No se encontraron Sucursales.</p>
          )}
        </div>
      </div>

      <BranchFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        branchToEdit={branchToEdit}
        onSave={handleSaveBranch}
      />
    </LayoutBaseAdmin>
  );
};

export default BranchesTable;