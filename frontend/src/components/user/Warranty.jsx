import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import { jwtDecode } from 'jwt-decode';
import LayoutBase from '../base/LayoutBaseUser';
import InfoModal from './InfoModal';
import '../../styles/user/warranty.css';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

export default function Warranty() {

  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      alert('Por favor, inicie sesión para acceder a esta página.');
      navigate('/user/login');
      return null;
    }
  }, [navigate]);

  const {user_id, user_first_name, email_address, role} = getCurrentUserInfo();
  const initialFormData = {
    mainCustomerID: '',
    branchID: '',
    RIF:'',
    RIFtype:'',
    purchaseDate: '',
    invoiceNumber: '',
    barCode: '',
    ItemId: '',
    isRetail: '',
    productBrand: '',
    productCategory: '',
    invoiceIMG: '',
  }

  const [formData, setFormData] = useState({
    mainCustomerID: '',
    branchID: '',
    RIF:'',
    RIFtype:'',
    purchaseDate: '',
    invoiceNumber: '',
    barCode: '',
    invoiceIMG: '',
    ItemId: '',
    isRetail: '',
    productBrand: '',
  });

  const RIFtypeOptions = ['V', 'E', 'J', 'G', 'C', 'P'];
  const [mainCustomers, setMainCustomers] = useState([]);
  const [branchAddresses, setBranchAddresses] = useState([]);
  const [products, setProducts] = useState([]);
  const [mainCustomerQuery, setMainCustomerQuery] = useState('');
  const [filteredMainCustomers, setFilteredMainCustomers] = useState([]);
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [suppressShowOnQuery, setSuppressShowOnQuery] = useState(false);
  const customerSearchRef = useRef(null);
  const inputRef = useRef(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const searchDebounceRef = useRef(null);
  const [editableField, setEditableField] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(true);

  const handleCloseInfoModal = () => {
    setShowInfoModal(false); 
  };

  // Normalizer: trim, collapse spaces, remove diacritics, lowercase
  const normalizeText = (s = '') =>
    s
      .toString()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^\p{L}\p{N} ]+/gu, ' ') // remove punctuation except letters/numbers
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

  const validateInvoiceNumber = (value) => {
    const pattern = /^[A-Za-z0-9\-\/]{5,20}$/;
    return pattern.test(value.trim());
  };

  const fetchProductByBarCode = async (barCode) => {
    const bar_code = barCode.trim();
    if (!bar_code) {
      alert('Por favor, ingrese un código de barras antes de buscar');
      return;
    }

    setFormData(prev => ({
      ...prev,
      ItemId: '',
      productBrand: '',
      brandCategory: '',
      productCategory: '',
      productDetail: ''
    }));

    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/getProductByBarCode/?barCode=${bar_code}`,
        { method: 'GET' }
      );

      const data = await response.json();

      if (response.ok) {
        setProducts(data);

        if (data && data.ID && data.Brand && data.Category && data.productDetail) {
          setFormData(prev => ({
            ...prev,
            ItemId: data.ID,
            productBrand: data.Brand || 'Marca del producto',
            brandCategory: `${data.Brand} - ${data.Category}` || 'Marca del producto - Categoría del producto',
            productCategory: data.Category || 'Categoría del producto',
            productDetail: data.productDetail || 'Detalles del producto',
          }));
        }
      } else {
        console.error(data.error);
        alert(data.error);
      }
    } catch {
      console.error('Error de conexión con el servidor');
      alert('Error de conexión con el servidor');
    }
  };

  const fetchMainCustomers = async () => {
    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/adminGetMainCustomers/`,
        {
          method: 'GET',
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Precompute normalized FullName to avoid repeated normalization on each keystroke
        const normalized = (data || []).map(mc => ({
          ...mc,
          _norm: normalizeText(mc.FullName || '')
        }));
        setMainCustomers(normalized);
      } else {
        console.error(data.error);
        alert(data.warning)
      }
    } catch {
      console.error('Error de conexión con el servidor');
    }
  };

  const fetchBranchAddresses = async (mainCustomerID, isRetail) => {
    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/getBranchByCustomerID/?mainCustomerID=${mainCustomerID}&isRetail=${isRetail}`,
        {
          method: 'GET',
        }
      );

      const data = await response.json();
      if (response.ok) {
        const branches = data || [];
        setBranchAddresses(branches);
        if (branches.length > 0) {
          // enable the branch select; do NOT autofill RIF here. RIF should be filled when user selects a branch.
          setEditableField(true);
          // ensure previous branch/RIF are cleared so user can pick a branch
          setFormData(prev => ({ ...prev, branchID: '', RIFtype: '', RIF: '' }));
        } else {
          // no branches for this customer
          setEditableField(false);
          setFormData(prev => ({ ...prev, branchID: '', RIFtype: '', RIF: '' }));
        }
      } else {
        console.error(data.error);
        //alert(data.error);
        setBranchAddresses([]);
        setEditableField(false);
        setFormData(prev => ({ ...prev, branchID: '', RIFtype: '', RIF: '' }));
      }
    } catch {
      console.error('Error de conexión con el servidor');
    }
  };

  // Handle form field changes
  const handleChange = ({ target: { name, value, files } }) => {
    if (name === 'mainCustomerID') {
      const [id, retail] = value.split('-');

      setFormData(prev => ({
        ...prev,
        mainCustomerID: id,
        isRetail: retail,
        branchID: '',
        RIFtype: '',
        RIF: '',
      }));
      if (value) fetchBranchAddresses(id, retail);
      else setBranchAddresses([]);

    } else if (name === 'branchID') {
      const selectedBranch = branchAddresses.find(
        b => String(b.branchID) === String(value)
      );
      if (selectedBranch) {
        setFormData(prev => ({
          ...prev,
          branchID: selectedBranch.branchID,
          RIFtype: selectedBranch.RIFtype,
          RIF: selectedBranch.RIF
        }));
      } else {
        setFormData(prev => ({ ...prev, branchID: value }));
      }
    } else if (name === 'RIF') {
        // Filter out any non-numeric characters from the RIF input
        const filteredValue = value.replace(/[^0-9]/g, '');
        setFormData(prevData => ({
            ...prevData,
            [name]: filteredValue
        }));
    } else if (name === 'purchaseDate') {
      // Ensure the date is always in YYYY-MM-DD format
      const formattedDate = value;
      setFormData(prev => ({
        ...prev,
        purchaseDate: formattedDate
      }));
    } else if (name === 'barCode') {
      const filteredValue = value.replace(/[^0-9]/g, '');
        setFormData(prevData => ({
            ...prevData,
            [name]: filteredValue
        }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    fetchMainCustomers();
  }, []);

  // Debounced filter of main customers to avoid rendering huge lists
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!mainCustomerQuery) {
      // If cleared, also clear selection and suggestions
      setFilteredMainCustomers([]);
      setShowCustomerSuggestions(false);
      setHighlightIndex(-1);
      return;
    }

    searchDebounceRef.current = setTimeout(() => {
      const qNorm = normalizeText(mainCustomerQuery);
      const tokens = qNorm.split(' ').filter(Boolean);

      // If we recently selected a suggestion and updated the input value programmatically,
      // suppress reopening the suggestions box on that update.
      if (suppressShowOnQuery) {
        setFilteredMainCustomers([]);
        setShowCustomerSuggestions(false);
        setHighlightIndex(-1);
        setSuppressShowOnQuery(false);
        return;
      }

      const matches = mainCustomers.filter(mc => {
        // Only search FullName (use precomputed _norm)
        if (!mc._norm) return false;
        // Every token must appear somewhere in the normalized full name (AND semantics)
        return tokens.every(t => mc._norm.includes(t));
      }).slice(0, 50);

      setFilteredMainCustomers(matches);
      setShowCustomerSuggestions(matches.length > 0);
      setHighlightIndex(-1);
    }, 200); // 200ms debounce

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [mainCustomerQuery, mainCustomers]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (customerSearchRef.current && !customerSearchRef.current.contains(e.target)) {
        setShowCustomerSuggestions(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Submit warranty registration
  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateInvoiceNumber(formData.invoiceNumber)) {
      alert('El número de factura no es válido. Use solo letras, números, guiones o barras, entre 5 y 20 caracteres.');
      return;
    }

    const selectedStore = mainCustomers.find(mc => String(mc.ID) === String(formData.mainCustomerID));
    const selectedBranch = branchAddresses.find(b => String(b.branchID) === String(formData.branchID));
    const img = document.getElementById("invoiceIMG").files[0];

    const warrantyData = new FormData();
    warrantyData.append('registerID', user_id);
    warrantyData.append('userFirstName', user_first_name);
    warrantyData.append('emailAddress', email_address);

    if (editableField) {
      warrantyData.append('branchID', formData.branchID);
      warrantyData.append('RIFtype', formData.RIFtype);
      warrantyData.append('RIF', formData.RIF);
    }
    else {
      warrantyData.append('branchID', '');
      warrantyData.append('RIFtype', '');
      warrantyData.append('RIF', '');
    }
    
    warrantyData.append('ItemId', formData.ItemId);
    warrantyData.append('isRetail', formData.isRetail);
    warrantyData.append('purchaseDate', formData.purchaseDate);
    warrantyData.append('productBrand', formData.productBrand);
    warrantyData.append('productModel', formData.productDetail);
    warrantyData.append('productBarcode', formData.barCode);
    warrantyData.append('invoiceNumber', formData.invoiceNumber);
    warrantyData.append('invoiceIMG', img);
    warrantyData.append('storeName', selectedStore ? selectedStore.FullName : '');
    warrantyData.append('branchName', selectedBranch ? selectedBranch.companyName : '');
    warrantyData.append('mainCustomerID', selectedStore.ID);
    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/warrantyRegister/`,
        {
          method: 'POST',
          body: warrantyData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setFormData(initialFormData);
        // Reset file input
        const fileInput = document.getElementById('invoiceIMG');
        if (fileInput) fileInput.value = '';
      } else {
        console.error(data.error);
        alert(data.warning);
      }
    } catch {
      console.error('Error de conexión con el servidor');
    }
  };

  return (
    <LayoutBase activePage="warranty">
       <InfoModal 
        isOpen={showInfoModal} 
        onClose={handleCloseInfoModal}
      />

      <div className="cardContainerWarranty">
        <h2>Registro de Garantía</h2>
        <form onSubmit={handleSubmit}>
          {/* Customer Select */}
          <label htmlFor="mainCustomerSearch">
            Compañía asociada <span className="required-asterisk">*</span>
          </label>
          <div ref={customerSearchRef} className="customer-search-container">
            <input
              type="text"
              id="mainCustomerSearch"
              name="mainCustomerSearch"
              placeholder="Busque la tienda donde compró el producto"
              value={mainCustomerQuery}
              onChange={e => {
                setMainCustomerQuery(e.target.value);
                // clear previously selected mainCustomerID and any branch/RIF while typing
                setFormData(prev => ({ ...prev, mainCustomerID: '', isRetail: '', branchID: '', RIFtype: '', RIF: '' }));
                // clear branch list and disable branch select until a customer is chosen
                setBranchAddresses([]);
                setEditableField(false);
              }}
              onFocus={() => mainCustomerQuery && setShowCustomerSuggestions(true)}
              ref={inputRef}
              onKeyDown={e => {
                if (!showCustomerSuggestions) return;
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHighlightIndex(i => Math.min(i + 1, filteredMainCustomers.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHighlightIndex(i => Math.max(i - 1, 0));
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  const sel = filteredMainCustomers[highlightIndex >= 0 ? highlightIndex : 0];
                  if (sel) {
                    // set selected main customer and clear previous branch/RIF selection
                    setFormData(prev => ({ ...prev, mainCustomerID: sel.ID, isRetail: sel.isRetail, branchID: '', RIFtype: '', RIF: '' }));
                    setMainCustomerQuery(sel.FullName || '');
                    setShowCustomerSuggestions(false);
                    setSuppressShowOnQuery(true);
                    fetchBranchAddresses(sel.ID, sel.isRetail);
                    // blur input to ensure suggestions close
                    if (inputRef.current && typeof inputRef.current.blur === 'function') inputRef.current.blur();
                  }
                } else if (e.key === 'Escape') {
                  setShowCustomerSuggestions(false);
                }
              }}
              required
              autoComplete="off"
              aria-autocomplete="list"
              aria-controls="mainCustomer-suggestions"
              aria-expanded={showCustomerSuggestions}
            />
            {showCustomerSuggestions && (
              <ul id="mainCustomer-suggestions" className="suggestions-list" role="listbox" style={{
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
                {filteredMainCustomers.length > 0 ? (
                  filteredMainCustomers.map((mc, idx) => (
                    <li
                      key={`${mc.ID}-${mc.isRetail}`}
                      onMouseDown={(e) => {
                          // prevent browser focusing the input before we blur
                          try { e.preventDefault(); } catch (err) {}
                          // set selected main customer and clear previous branch/RIF selection
                          setFormData(prev => ({ ...prev, mainCustomerID: mc.ID, isRetail: mc.isRetail, branchID: '', RIFtype: '', RIF: '' }));
                          setMainCustomerQuery(mc.FullName || '');
                          setShowCustomerSuggestions(false);
                          setSuppressShowOnQuery(true);
                          fetchBranchAddresses(mc.ID, mc.isRetail);
                          if (inputRef.current && typeof inputRef.current.blur === 'function') inputRef.current.blur();
                        }}
                      onMouseEnter={() => setHighlightIndex(idx)}
                      role="option"
                      aria-selected={highlightIndex === idx}
                      style={{
                        padding: '8px 10px',
                        cursor: 'pointer',
                        background: highlightIndex === idx ? '#eef' : 'transparent'
                      }}
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

          {editableField && (
            <>
              <label htmlFor="branchID">
                Sucursal <span className="required-asterisk">*</span>
              </label>
              <select
                id="branchID"
                name="branchID"
                required={editableField}
                value={formData.branchID}
                onChange={handleChange}
                disabled={!formData.mainCustomerID}
              >
                <option value="" disabled>Seleccione una sucursal</option>
                {branchAddresses.map(branch => (
                  <option key={branch.branchID} value={branch.branchID}>
                    {branch.companyName} - {branch.address}
                  </option>
                ))}
              </select>

              {/* Auto-filled and locked RIFtype */}
              <label htmlFor="RIFtype">
                RIF de la tienda <span className="required-asterisk">*</span>
                </label>
                <div className="rif-container">
                    <div className="rif-type">
                        <select
                          id="RIFtype"
                          name="RIFtype"
                          required={editableField}
                          value={formData.RIFtype}
                          onChange={handleChange}
                          disabled={editableField}
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
                          required={editableField}
                          value={formData.RIF}
                          onChange={handleChange}
                          disabled={editableField}
                        />
                    </div>
              </div>
            </>
          )}

          <label htmlFor="purchaseDate">
            Fecha de compra <span className="required-asterisk">*</span>
            </label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            required
            value={formData.purchaseDate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
          />

          <label htmlFor="barCode">
            Código de Barras <span className="required-asterisk">*</span>
            </label>
          <br />
          <div className="search-container">
            <input
              type="text"
              id="barCode"
              name="barCode"
              placeholder="Código de Barras"
              required
              value={formData.barCode}
              onChange={handleChange}
              style={{ flex: 1 }}
            />
            <button
            type='button'
            className='search-button'
            onClick={() => fetchProductByBarCode(formData.barCode)}
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="white"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 
                      1.398h-.001l3.85 3.85a1 1 0 0 0 
                      1.415-1.415l-3.85-3.85zm-5.242 
                      1.656a5 5 0 1 1 0-10 5 5 0 0 1 
                      0 10z"/>
            </svg>
            </button>
          </div>
          <br />
          
          <label htmlFor="brandCategory">Marca y categoría del producto:</label>
          <input
            type="text"
            id="brandCategory"
            name="brandCategory"
            placeholder="Marca del producto - Categoría del producto"
            required
            value={formData.brandCategory}
            onChange={handleChange}
            disabled={!!formData.brandCategory}
          />

          <label htmlFor="productDetail">Descripción del producto:</label>
          <input
            type="text"
            id="productDetail"
            name="productDetail"
            placeholder="Detalles del producto"
            required
            value={formData.productDetail}
            onChange={handleChange}
            disabled={!!formData.productDetail}
          />

          <label htmlFor="invoiceNumber">
            Número de Factura <span className="required-asterisk">*</span>
            </label>
          <input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            placeholder="Número de Factura"
            minLength={5}
            maxLength={20}
            required
            value={formData.invoiceNumber}
            onChange={handleChange}
          />

          <label htmlFor="invoiceIMG">
            Subir imagen de la factura de la compra <span className="required-asterisk">*</span>
            </label>
          <input
            type="file"
            id="invoiceIMG"
            name="invoiceIMG"
            accept="image/*, .pdf"
            required
            onChange={handleChange}
          />
          <small style={{ display: 'block', marginBottom: '12px', color: '#555' }}>
            Solo se aceptan archivos JPG, PNG, PDF
          </small>

          <button className="inputWarranty" type="submit">Guardar Garantía</button>
        </form>
      </div>
    </LayoutBase>
  );
}