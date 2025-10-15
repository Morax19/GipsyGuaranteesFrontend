import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import '../../styles/admin/userFormModal.css';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

const BranchFormModal = ({ isOpen, onClose, branchToEdit, onSave, mainCustomers, onReload }) => {
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      alert('Por favor, inicie sesión para acceder a esta página.');
      navigate('/admin/login');
      return null;
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    branchID: '',
    customerID: '',
    isRetail: '',
    RIFtype: '',
    RIF: '',
    companyName: '',
    address: '',
    branchDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const RIFtypeOptions = ['V', 'E', 'J', 'G', 'C', 'P'];

  // Local customer states for autocomplete
  const [customersList, setCustomersList] = useState([]);
  const [customerQuery, setCustomerQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [suppressShowOnQuery, setSuppressShowOnQuery] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const searchDebounceRef = useRef(null);
  const inputRef = useRef(null);

  // timestamp (ms) until which showing suggestions should be suppressed (legacy - will remove uses)
  const suppressShowUntilRef = useRef(0);
  // wrapper ref to detect outside clicks
  const wrapperRef = useRef(null);

  const normalizeText = (s = '') =>
    s
      .toString()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^\p{L}\p{N} ]+/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

  useEffect(() => {
  if (branchToEdit) {
      // Format the data to match the select value string
      setFormData({
        ...branchToEdit,
        customerID: `${branchToEdit.customerID}-${branchToEdit.isRetail}`,
        isRetail: `${branchToEdit.isRetail}`
      });
      setIsEditMode(true);
    } else {
      setFormData({
        branchID: '',
        customerID: '',
        isRetail: '',
        RIFtype: '',
        RIF: '',
        companyName: '',
        address: '',
        branchDescription: '',
      });
      setIsEditMode(false);
    }
  }, [branchToEdit]);

  // When prop mainCustomers changes, precompute normalized names
  useEffect(() => {
    const normalized = (mainCustomers || []).map(mc => ({
      ...mc,
      _norm: normalizeText(mc.FullName || '')
    }));
    setCustomersList(normalized);
  }, [mainCustomers]);

  // Debounced filtering of customersList
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!customerQuery) {
      setFilteredCustomers([]);
      setShowCustomerSuggestions(false);
      setHighlightIndex(-1);
      return;
    }

    searchDebounceRef.current = setTimeout(() => {
      const qNorm = normalizeText(customerQuery);
      const tokens = qNorm.split(' ').filter(Boolean);

      // If we recently selected a suggestion and updated the input value programmatically,
      // suppress reopening the suggestions box on that update. Also respect a short
      // timestamp-based suppression to cover timing races.
      if (suppressShowOnQuery || Date.now() < (suppressShowUntilRef.current || 0)) {
        setFilteredCustomers([]);
        setShowCustomerSuggestions(false);
        setHighlightIndex(-1);
        setSuppressShowOnQuery(false);
        return;
      }

      const matches = customersList.filter(c => {
        if (!c._norm) return false;
        return tokens.every(t => c._norm.includes(t));
      }).slice(0, 50);

      setFilteredCustomers(matches);
      setShowCustomerSuggestions(matches.length > 0);
      setHighlightIndex(-1);
    }, 200);

    return () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); };
  }, [customerQuery, customersList, suppressShowOnQuery]);

  // Close suggestions when clicking outside of the input/suggestions area
  // Close suggestions when clicking outside (use 'click' to match Warranty.jsx behavior)
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowCustomerSuggestions(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'customerID') {
        const [id, retail] = value.split('-');
        setFormData(prevData => ({
            ...prevData,
            customerID: value, 
            isRetail: retail,
        }));
    } else if (name === 'RIF') {
        // Filter out any non-numeric characters from the RIF input
        const filteredValue = value.replace(/[^0-9]/g, '');
        setFormData(prevData => ({
            ...prevData,
            [name]: filteredValue
        }));
      } else {
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? (checked ? '1' : '0') : value
        }));
    }
  };

  const handleSave = () => {
    setLoading(true);

    if (!formData.customerID || !formData.RIFtype || !formData.RIF || !formData.companyName || !formData.address) {
      alert('Por favor, complete todos los campos obligatorios (ID de Cliente, Tipo RIF, RIF, Nombre de Compañía, Dirección).');
      setLoading(false);
      return;
    }

    // Convert string values back to numbers for the API call
    const [customerID, isRetail] = formData.customerID.split('-');
    
    const dataToSend = {
      ...formData,
      customerID: parseInt(customerID),
      isRetail: isRetail
    };

    const endpoint = isEditMode ? 'adminEditBranch' : 'adminCreateBranch';
    const method = isEditMode ? 'PUT' : 'POST';
    (async () => {
      try {
        const response = await fetchWithAuth(
          `${apiUrl}/api/${endpoint}/`,
          {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert(isEditMode ? 'Sucursal actualizada correctamente.' : 'Sucursal creada correctamente.');
          onSave(data, isEditMode);
          setLoading(false);
          onClose();
          onReload();
        } else {
          setLoading(false);
          alert(data.warning);
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
        alert('Error de conexión con el servidor');
      }
    })();
  };

  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay-user">
      <div className="modal-content-user">
        <div className="modal-header-user">
          <h3>{isEditMode ? 'Editar Sucursal' : 'Agregar Sucursal'}</h3>
          <button className="close-button-user" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body-user">
          {isEditMode && (
            <div className="form-group-user">
              <label htmlFor="branchID">ID de Sucursal:</label>
              <input
                type="text"
                id="branchID"
                name="branchID"
                value={formData.branchID}
                disabled
              />
            </div>
          )}
          
          <div className="form-group-user">
            <label htmlFor="customerID">
              Compañía asociada <span className="required-asterisk">*</span>
            </label>
            <div style={{ position: 'relative' }} ref={wrapperRef}>
              <input
                type="text"
                id="customerID"
                name="customerID"
                placeholder="Busque la compañía asociada"
                value={customerQuery || (formData.customerID ? (mainCustomers.find(m => `${m.ID}-${m.isRetail}` === formData.customerID)?.FullName || '') : '')}
                onChange={e => {
                  setCustomerQuery(e.target.value);
                  // clear previously selected customerID while typing
                  setFormData(prev => ({ ...prev, customerID: '' }));
                }}
                // Do not auto-open suggestions on focus to avoid focus/blur races.
                // Suggestions are opened by the debounced filter effect when results exist.
                ref={inputRef}
                autoComplete="new-password"
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                onKeyDown={e => {
                  if (!showCustomerSuggestions) return;
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setHighlightIndex(i => Math.min(i + 1, filteredCustomers.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setHighlightIndex(i => Math.max(i - 1, 0));
          } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const sel = filteredCustomers[highlightIndex >= 0 ? highlightIndex : 0];
                    if (sel) {
                      const val = `${sel.ID}-${sel.isRetail}`;
                      // set suppression BEFORE changing the input query to avoid the
                      // debounced filter reopening the suggestions due to the programmatic update
                      setSuppressShowOnQuery(true);
                      suppressShowUntilRef.current = Date.now() + 350;
                      setFormData(prev => ({ ...prev, customerID: val, isRetail: `${sel.isRetail}` }));
                      // Clear the typed query; the input will show the selected
                      // FullName from `mainCustomers` lookup (via formData.customerID)
                      setCustomerQuery('');
                      setShowCustomerSuggestions(false);
                      setFilteredCustomers([]);
                      // blur input
                      if (inputRef.current && typeof inputRef.current.blur === 'function') inputRef.current.blur();
                    }
                  } else if (e.key === 'Escape') {
                    setShowCustomerSuggestions(false);
                  }
                }}
                required
              />

              {showCustomerSuggestions && (
                <ul style={{
                  position: 'absolute',
                  zIndex: 40,
                  left: 0,
                  right: 0,
                  maxHeight: '240px',
                  overflowY: 'auto',
                  background: 'white',
                  border: '1px solid #ccc',
                  listStyle: 'none',
                  margin: 0,
                  padding: 0
                }}>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((mc, idx) => (
                      <li
                        key={`${mc.ID}-${mc.isRetail}`}
                        onMouseDown={e => { try { e.preventDefault(); } catch {};
                          const val = `${mc.ID}-${mc.isRetail}`;
                          // set suppression BEFORE updating query
                          setSuppressShowOnQuery(true);
                          suppressShowUntilRef.current = Date.now() + 350;
                          setFormData(prev => ({ ...prev, customerID: val, isRetail: `${mc.isRetail}` }));
                          // Clear the typed query so debounced filter doesn't re-open suggestions
                          setCustomerQuery('');
                          setShowCustomerSuggestions(false);
                          setFilteredCustomers([]);
                          if (inputRef.current && typeof inputRef.current.blur === 'function') inputRef.current.blur();
                        }}
                        onMouseEnter={() => setHighlightIndex(idx)}
                        style={{ padding: '8px 10px', cursor: 'pointer', background: highlightIndex === idx ? '#eef' : 'transparent' }}
                      >
                        {mc.FullName}
                      </li>
                    ))
                  ) : (
                    <li style={{ padding: '8px 10px' }}>No se encontraron resultados</li>
                  )}
                </ul>
              )}
            </div>
          </div>

          <div className="form-group-user">
            <label htmlFor="RIFtype">
              RIF de la tienda <span className="required-asterisk">*</span>
            </label>
            <div className="rif-container-modal">
              <div className="rif-type">
                  <select
                    id="RIFtype"
                    name="RIFtype"
                      value={formData.RIFtype}
                      onChange={handleChange}
                      //disabled={formData.isRetail === 'false'}
                    >
                      <option value="">Tipo</option>
                      {RIFtypeOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                </div>
                <div className="rif-number">
                    <input
                      type="number"
                      id="RIF"
                      name="RIF"
                      placeholder="Número de RIF"
                      maxLength={10}
                      required
                      value={formData.RIF}
                      onChange={handleChange}
                      //disabled={formData.isRetail === 'false'}
                    />
                </div>
            </div>
          </div>
             
          <div className="form-group-user">
            <label htmlFor="companyName">
              Nombre de la sucursal <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Ingrese el nombre de la sucursal"
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="address">
              Dirección <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ingrese la dirección de la sucursal"
            />
          </div>

          <div className="form-group-user">
            <label htmlFor="branchDescription">
              Descripción de Sucursal <span className="required-asterisk">*</span>
            </label>
            <textarea
              id="branchDescription"
              name="branchDescription"
              value={formData.branchDescription}
              onChange={handleChange}
              placeholder="Ingrese una descripción"
              rows="3"
            />
          </div>
        </div>

        <div className="modal-footer-user">
          <button className="modal-button-user cancel-button-user" onClick={onClose}>Cancelar</button>
          <button className="modal-button-user save-button-user" disabled={loading} onClick={handleSave}>
            {isEditMode ? (loading ? 'Guardando...' : 'Guardar Cambios') : (loading ? 'Agregando...' : 'Agregar Sucursal')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchFormModal;