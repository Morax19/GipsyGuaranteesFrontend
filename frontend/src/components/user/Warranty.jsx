import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import { jwtDecode } from 'jwt-decode';
import LayoutBase from '../base/LayoutBaseUser';
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
        alert(data.warning);
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
        setMainCustomers(data);
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
        setBranchAddresses(data);
      } else {
        console.error(data.error);
        setBranchAddresses([]);
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

  // Submit warranty registration
  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateInvoiceNumber(formData.invoiceNumber)) {
      alert('El número de factura no es válido. Use solo letras, números, guiones o barras, entre 5 y 20 caracteres.');
      return;
    }

    const img = document.getElementById("invoiceIMG").files[0];
    const warrantyData = new FormData();
    warrantyData.append('registerID', user_id);
    warrantyData.append('branchID', formData.branchID);
    warrantyData.append('ItemId', formData.ItemId);
    warrantyData.append('isRetail', formData.isRetail);
    warrantyData.append('purchaseDate', formData.purchaseDate);
    warrantyData.append('productBrand', formData.productBrand);
    warrantyData.append('productBarcode', formData.barCode);
    warrantyData.append('invoiceNumber', formData.invoiceNumber);
    warrantyData.append('invoiceIMG', img);

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
      <div className="cardContainerWarranty">
        <h2>Registro de Garantía</h2>
        <form onSubmit={handleSubmit}>
          {/* Customer Select */}
          <label htmlFor="mainCustomerID">
            Compañía asociada <span className="required-asterisk">*</span>
            </label>
          <select
            id="mainCustomerID"
            name="mainCustomerID"
            value={formData.mainCustomerID ? `${formData.mainCustomerID}-${formData.isRetail}` : ''}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Tienda donde compró el producto</option>
            {mainCustomers.map(mc => (
              <option key={`${mc.ID}-${mc.isRetail}`} value={`${mc.ID}-${mc.isRetail}`}>
                {mc.FullName}
              </option>
            ))}
          </select>

          <label htmlFor="branchID">
            Sucursal <span className="required-asterisk">*</span>
            </label>
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

          {/* Auto-filled and locked RIFtype */}
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
                      disabled={formData.isRetail === 'false'}
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
                      disabled={formData.isRetail === 'false'}
                    />
                </div>
          </div>

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
            Factura del producto <span className="required-asterisk">*</span>
            </label>
          <input
            type="file"
            id="invoiceIMG"
            name="invoiceIMG"
            accept="image/*, .pdf"
            required
            onChange={handleChange}
          />

          <button className="inputWarranty" type="submit">Guardar Garantía</button>
        </form>
      </div>
    </LayoutBase>
  );
}