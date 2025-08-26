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

  const {user_id, email_address, role} = getCurrentUserInfo();
  const initialFormData = {
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
    invoiceCopyPath: '',
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
    invoiceCopyPath: '',
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
    const bar_code = barCode.trim()
    if (!bar_code){
      alert('Por favor, ingrese un código de barras antes de buscar')
      return;
    }

    setFormData(prev => ({
      ...prev,
      ItemId: '',
      productBrand: '',
      productCategory: ''
    }));

    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/getProductByBarCode/?barCode=${bar_code}`,
        {
          method: 'GET',
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProducts(data);

        if (data && data.ID && data.Brand && data.Category){

          setFormData(prev => ({
            ...prev,
            ItemId: data.ID,
            productBrand: data.Brand || 'Marca del producto',
            productCategory: data.Category || 'Categoría del producto'
          }));
        }
      } else {
        console.error(data.error || 'Error al obtener los productos');
        alert(data.error || 'Error al obtener los productos');
      }
    } catch {
      console.error('Error de conexión con el servidor');
      aler('Error de conexión con el servidor');
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
        console.error(data.error || 'Error fetching MainCustomers');
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
        console.error(data.message || 'Error fetching branch addresses');
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
    
    const warrantyData = {
      registerID: user_id,
      branchID: formData.branchID,
      ItemId: formData.ItemId,
      isRetail: formData.isRetail,
      purchaseDate: formData.purchaseDate,
      productBrand: formData.productBrand,
      productBarcode: formData.barCode,
      invoiceNumber: formData.invoiceNumber,
    }

    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/warrantyRegister/`,
        {
          method: 'POST',
          body: JSON.stringify(warrantyData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log(data.message || '¡Garantía guardada exitosamente!');
        alert(data.message || '¡Garantía guardada exitosamente!');
        setFormData(initialFormData);
      } else {
        console.error(data.error || 'Error al guardar la garantía');
        alert(data.error || 'Error al guardar la garantía');
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
          <label htmlFor="mainCustomerID">Compañía asociada:</label>
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

          <label htmlFor="branchID">Sucursal:</label>
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
          <label htmlFor="RIFtype">Tipo RIF:</label>
          <select
            id="RIFtype"
            name="RIFtype"
            value={formData.RIFtype}
            onChange={handleChange}
            disabled={formData.isRetail === 'false'}
          >
            <option value="">Seleccione un tipo</option>
            {RIFtypeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          {/* Auto-filled RIF */}
          <label htmlFor="RIF">RIF de la tienda:</label>
          <input
            type="text"
            id="RIF"
            name="RIF"
            placeholder="RIF de la tienda"
            maxLength={10}
            required
            value={formData.RIF}
            onChange={handleChange}
            disabled={formData.isRetail === 'false'}
          />

          <label htmlFor="purchaseDate">Fecha de compra:</label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            required
            value={formData.purchaseDate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
          />

          <label htmlFor="barCode">Código de Barras:</label>
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
          
          <label htmlFor="productBrand">Marca del producto:</label>
          <input
            type="text"
            id="productBrand"
            name="productBrand"
            placeholder="Marca del producto"
            required
            value={formData.productBrand}
            onChange={handleChange}
            disabled={!!formData.productBrand}
          />

          <label htmlFor="productCategory">Categoría del producto:</label>
          <input
            type="text"
            id="productCategory"
            name="productCategory"
            placeholder="Categoría del producto"
            required
            value={formData.productCategory}
            onChange={handleChange}
            disabled={!!formData.productCategory}
          />

          <label htmlFor="invoiceNumber">Número de Factura:</label>
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

          <label htmlFor="invoiceIMG">Factura del producto:</label>
          <input
            type="file"
            id="invoiceIMG"
            name="invoiceIMG"
            accept="image/*"
            //required
            onChange={handleChange}
          />

          <button className="inputWarranty" type="submit">Guardar Garantía</button>
        </form>
      </div>
    </LayoutBase>
  );
}