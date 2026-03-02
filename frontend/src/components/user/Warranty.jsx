import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import LayoutBase from '../base/LayoutBaseUser';
import InfoModal from './InfoModal';
import '../../styles/user/warranty.css';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

export default function Warranty() {
  const {user_id, user_first_name, email_address} = getCurrentUserInfo();
  
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
    brandCategory: '',
    productDetail: '',
    invoiceIMG: null, // FIX: Iniciamos como null para manejar el archivo en estado
  }
  
  const [formData, setFormData] = useState(initialFormData);

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
  
  // FIX: Renombrado de editableField a hasBranches para mayor claridad
  const [hasBranches, setHasBranches] = useState(false); 
  
  const [showInfoModal, setShowInfoModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCloseInfoModal = () => {
    setShowInfoModal(false); 
  };

  const normalizeText = (s = '') =>
    s
      .toString()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^\p{L}\p{N} ]+/gu, ' ') 
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

  const validateInvoiceNumber = (value) => {
    const pattern = /^[A-Za-z0-9\-\/]{5,20}$/;
    return pattern.test(value.trim());
  };

  const fetchMainCustomers = async (itemID) => {
    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/getMainCustomersWarrantyRegister/?itemID=${itemID}`,
        { method: 'GET' }
      );

      const data = await response.json();
      if (response.ok) {
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
        { method: 'GET' }
      );

      const data = await response.json();
      if (response.ok) {
        const branches = data || [];
        setBranchAddresses(branches);
        if (branches.length > 0) {
          setHasBranches(true); // FIX: Usamos el nuevo nombre
          setFormData(prev => ({ ...prev, branchID: '', RIFtype: '', RIF: '' }));
        } else {
          setHasBranches(false);
          setFormData(prev => ({ ...prev, branchID: '', RIFtype: '', RIF: '' }));
        }
      } else {
        console.error(data.error);
        setBranchAddresses([]);
        setHasBranches(false);
        setFormData(prev => ({ ...prev, branchID: '', RIFtype: '', RIF: '' }));
      }
    } catch {
      console.error('Error de conexión con el servidor');
    }
  };

  const handleChange = ({ target: { name, value, files } }) => {
    // FIX: Eliminado el bloque de 'mainCustomerID' (Código Muerto)
    
    if (name === 'branchID') {
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
        const filteredValue = value.replace(/[^0-9]/g, '');
        setFormData(prevData => ({ ...prevData, [name]: filteredValue }));
    } else if (name === 'purchaseDate') {
      setFormData(prev => ({ ...prev, purchaseDate: value }));
    } else if (name === 'barCode') {
      const filteredValue = value.replace(/[^0-9]/g, '');
      setFormData(prevData => ({
          ...prevData,
          [name]: filteredValue,
          // FIX: Forzar limpieza del producto si se edita el código de barras manualemente
          ItemId: '',
          productBrand: '',
          productCategory: '',
          brandCategory: '',
          productDetail: '',
          mainCustomerID: '',
          branchID: '',
          RIFtype: '',
          RIF: ''
      }));
      // FIX: Resetear tiendas si se borra o cambia el código
      setMainCustomers([]);
      setBranchAddresses([]);
      setMainCustomerQuery('');
    } else if (name === 'invoiceIMG') {
      // FIX: Manejo correcto del archivo vía estado de React
      setFormData(prev => ({ ...prev, invoiceIMG: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const fetchProductByBarCode = async (barCode) => {
    const bar_code = barCode.trim();
    if (!bar_code) {
      alert('Por favor, ingrese un código de barras antes de buscar');
      return;
    }

    // Limpiar campos previos
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
            brandCategory: `${data.Brand} - ${data.Category}`,
            productCategory: data.Category || 'Categoría del producto',
            productDetail: data.productDetail || 'Detalles del producto',
          }));
          fetchMainCustomers(data.ID);
        }
      } else {
        console.error(data.error);
        alert(data.error);
      }
    } catch {
      alert('Error de conexión con el servidor');
    }
  };

  // Debounce Autocomplete
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!mainCustomerQuery) {
      setFilteredMainCustomers([]);
      setShowCustomerSuggestions(false);
      setHighlightIndex(-1);
      return;
    }

    searchDebounceRef.current = setTimeout(() => {
      const qNorm = normalizeText(mainCustomerQuery);
      const tokens = qNorm.split(' ').filter(Boolean);

      if (suppressShowOnQuery) {
        setFilteredMainCustomers([]);
        setShowCustomerSuggestions(false);
        setHighlightIndex(-1);
        setSuppressShowOnQuery(false);
        return;
      }

      const matches = mainCustomers.filter(mc => {
        if (!mc._norm) return false;
        return tokens.every(t => mc._norm.includes(t));
      }).slice(0, 50);

      setFilteredMainCustomers(matches);
      setShowCustomerSuggestions(matches.length > 0);
      setHighlightIndex(-1);
    }, 200); 

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [mainCustomerQuery, mainCustomers]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (customerSearchRef.current && !customerSearchRef.current.contains(e.target)) {
        setShowCustomerSuggestions(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    // FIX: Validar que el usuario haya hecho "Buscar" en el código de barras y exista ItemId
    if (!formData.ItemId) {
      setLoading(false);
      alert('Por favor, presione el ícono de búsqueda del código de barras para identificar el producto.');
      return;
    }

    if (!validateInvoiceNumber(formData.invoiceNumber)) {
      setLoading(false);
      alert('El número de factura no es válido. Use solo letras, números, guiones o barras, entre 5 y 20 caracteres.');
      return;
    }

    const selectedStore = mainCustomers.find(mc => String(mc.ID) === String(formData.mainCustomerID));
    if (!selectedStore) {
      setLoading(false);
      alert('Debe seleccionar una compañía asociada válida de la lista.');
      return;
    }

    const selectedBranch = branchAddresses.find(b => String(b.branchID) === String(formData.branchID));

    const warrantyData = new FormData();
    warrantyData.append('registerID', user_id);
    warrantyData.append('userFirstName', user_first_name);
    warrantyData.append('emailAddress', email_address);

    if (hasBranches) {
      warrantyData.append('branchID', formData.branchID);
      warrantyData.append('RIFtype', formData.RIFtype);
      warrantyData.append('RIF', formData.RIF);
    } else {
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
    warrantyData.append('invoiceIMG', formData.invoiceIMG); // FIX: Se obtiene directamente del estado
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
        setMainCustomerQuery(''); // Limpiar autocompletado
        const fileInput = document.getElementById('invoiceIMG');
        if (fileInput) fileInput.value = '';
        
        try { navigate('/user/home', { replace: true }); } catch (err) {}
      } else {
        alert(data.warning || data.error);
      }
    } catch {
      alert('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutBase activePage="warranty">
       <InfoModal 
        isOpen={showInfoModal} 
        onClose={handleCloseInfoModal}
      />

      <div className="cardContainerWarranty">

        <div className="header-with-info">
          <h2>Registro de Garantía</h2>
          <div className="info-tooltip-container" tabIndex={0}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              fill="currentColor" 
              className="bi bi-info-circle-fill info-icon" 
              viewBox="0 0 16 16"
            >
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg>
            <div className="tooltip-bubble">
              Si requiere ayuda para llenar el formulario, puede ver el <a href="https://www.youtube.com/watch?v=grZJtXr_45A" target="_blank" rel="noopener noreferrer">video tutorial</a>.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="barCode">
            Código de Barras <span className="required-asterisk">*</span>
          </label>
          <small style={{ color: '#555', marginLeft: '70px', marginRight: '70px', marginBottom: '8px', display: 'block'}}>
            Ingrese el código de barras del producto y presione el ícono de búsqueda para autocompletar los detalles del producto.
          </small>
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
          
          <label htmlFor="brandCategory">
            Marca y categoría del producto:
          </label>
          <small style={{ color: '#555', marginLeft: '70px', marginRight: '70px', display: 'block'}}>
            La marca y categoría del producto se completan automáticamente después de buscar el código de barras.
          </small>
          <input
            type="text"
            id="brandCategory"
            name="brandCategory"
            placeholder="Marca del producto - Categoría del producto"
            required
            value={formData.brandCategory}
            onChange={handleChange}
            disabled
          />

          <label htmlFor="productDetail">
            Descripción del producto:
          </label>
          <small style={{ color: '#555', marginLeft: '70px', marginRight: '70px', display: 'block'}}>
            La descripción del producto se completa automáticamente después de buscar el código de barras.
          </small>
          <input
            type="text"
            id="productDetail"
            name="productDetail"
            placeholder="Detalles del producto"
            required
            value={formData.productDetail}
            onChange={handleChange}
            disabled
          />

          <label htmlFor="mainCustomerSearch">
            Compañía asociada <span className="required-asterisk">*</span>
          </label>
          <small style={{ color: '#555', marginLeft: '70px', marginRight: '70px', display: 'block'}}>
            Es necesario ingresar el producto para seleccionar la compañía asociada. Escriba el nombre de la compañía y selecciónela de la lista.
          </small>
          <div ref={customerSearchRef} className="customer-search-container">
            <input
              type="text"
              id="mainCustomerSearch"
              name="mainCustomerSearch"
              placeholder="Busque la tienda donde compró el producto"
              value={mainCustomerQuery}
              onChange={e => {
                setMainCustomerQuery(e.target.value);
                setFormData(prev => ({ ...prev, mainCustomerID: '', isRetail: '', branchID: '', RIFtype: '', RIF: '' }));
                setBranchAddresses([]);
                setHasBranches(false);
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
                    setFormData(prev => ({ ...prev, mainCustomerID: sel.ID, isRetail: sel.isRetail, branchID: '', RIFtype: '', RIF: '' }));
                    setMainCustomerQuery(sel.FullName || '');
                    setShowCustomerSuggestions(false);
                    setSuppressShowOnQuery(true);
                    fetchBranchAddresses(sel.ID, sel.isRetail);
                    if (inputRef.current && typeof inputRef.current.blur === 'function') inputRef.current.blur();
                  }
                } else if (e.key === 'Escape') {
                  setShowCustomerSuggestions(false);
                }
              }}
              required
              autoComplete="off"
            />
            {showCustomerSuggestions && (
              <ul id="mainCustomer-suggestions" className="suggestions-list" role="listbox" style={{
                position: 'absolute', zIndex: 40, left: 0, right: 0, maxHeight: '240px',
                overflowY: 'auto', background: 'white', border: '1px solid #ccc',
                listStyle: 'none', margin: 0, padding: 0
              }}>
                {filteredMainCustomers.length > 0 ? (
                  filteredMainCustomers.map((mc, idx) => (
                    <li
                      key={`${mc.ID}-${mc.isRetail}`}
                      onMouseDown={(e) => {
                          try { e.preventDefault(); } catch (err) {}
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
                      {`${mc.FullName}`}
                    </li>
                  ))
                ) : (
                  <li style={{ padding: '8px 10px' }}>No se encontraron resultados</li>
                )}
              </ul>
            )}
          </div>

          {/* FIX: Uso semántico de hasBranches. Eliminado required innecesario de inputs deshabilitados */}
          {hasBranches && (
            <>
              <label htmlFor="branchID">
                Sucursal <span className="required-asterisk">*</span>
              </label>
              <small style={{ color: '#555', marginLeft: '70px', marginRight: '70px', display: 'block'}}>
                Seleccione la sucursal donde realizó la compra.
              </small>
              <select
                id="branchID"
                name="branchID"
                required
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

              <label htmlFor="RIFtype">
                RIF de la tienda <span className="required-asterisk">*</span>
              </label>
              <div className="rif-container">
                <div className="rif-type">
                  <select
                    id="RIFtype"
                    name="RIFtype"
                    value={formData.RIFtype}
                    onChange={handleChange}
                    disabled // Bloqueado, solo lectura
                  >
                    <option value="">Tipo</option>
                    {RIFtypeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="rif-number">
                  <input
                    type="text"         // FIX: number a text para evitar fallos con el reemplazo Regex
                    inputMode="numeric" // FIX: Mantiene el teclado numérico en móviles
                    id="RIF"
                    name="RIF"
                    placeholder="Número de RIF"
                    maxLength={10}
                    value={formData.RIF}
                    onChange={handleChange}
                    disabled // Solo lectura
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
            max={new Date().toISOString().split('T')[0]} 
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

          <button className="inputWarranty" type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Guardar Garantía'}
          </button>
        </form>
      </div>
    </LayoutBase>
  );
}