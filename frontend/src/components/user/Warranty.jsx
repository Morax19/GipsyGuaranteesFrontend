import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import LayoutBase from '../base/LayoutBaseUser';
import '../../styles/user/warranty.css';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

export default function Warranty() {
  const [formData, setFormData] = useState({
    mainCustomerID: '',
    branchID: '',
    RIF:'',
    RIFtype:'',
    purchaseDate: '',
    purchaseDateFormatted: '',
    invoiceNumber: '',
    barCode: '',
    invoiceIMG: '', 
  });

  const RIFtypeOptions = ['V', 'E', 'J', 'G', 'C', 'P'];
  const [mainCustomers, setMainCustomers] = useState([]);
  const [branchAddresses, setBranchAddresses] = useState([]);
  const validateInvoiceNumber = (value) => {
    const pattern = /^[A-Za-z0-9\-\/]{5,20}$/;
    return pattern.test(value.trim());
  };

  const navigate = useNavigate();

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
        console.error(data.message || 'Error fetching MainCustomers');
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

      // Find the main customer object so we can grab RIF data for retail == 'true'
      const selectedCustomer = mainCustomers.find(
        mc => String(mc.ID) === String(id)
      );

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
      const og = value;
      const [month, day, year] = og.split('/');
      const formatted = `${day}/${month}/${year}`;

      setFormData(prev => ({
        ...prev,
        purchaseDate: og,
        purchaseDateFormatted: formatted
      }))
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
    
    alert(`${purchaseDate} vs ${purchaseDateFormatted}`)
    if (!validateInvoiceNumber(formData.invoiceNumber)) {
      alert('El número de factura no es válido. Use solo letras, números, guiones o barras, entre 5 y 20 caracteres.');
      return;
    }

    try {
      // Use FormData to send both text and file data
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await fetchWithAuth(
        `${apiUrl}/api/warrantyRegister/`,
        {
          method: 'POST',
          body: formDataToSend
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log('¡Garantía guardada exitosamente!');
        // reset form or redirect here if desired
      } else {
        console.error(data.message || 'Error al guardar la garantía');
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
            type="text"
            id="purchaseDate"
            name="purchaseDate"
            placeholder='DD/MM/YYYY'
            required
            value={formData.purchaseDateFormatted}
            onChange={(e) => {
              // optional: simple regex check or mask to keep format consistent
              setFormData(prev => ({ ...prev, purchaseDateFormatted: e.target.value }));
            }}
            onBlur={() => {
              // on blur, optionally parse and set the raw YYYY-MM-DD
              const [day, month, year] = formData.purchaseDateFormatted.split('/');
              setFormData(prev => ({
                ...prev,
                purchaseDate: `${year}-${month}-${day}`
              }));
            }}
          />

          <label htmlFor="barCode">Código de Barras:</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
          className='inputWarranty'
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 10px'
          }}
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
            required
            onChange={handleChange}
          />

          <button className="inputWarranty" type="submit">Guardar Garantía</button>
        </form>
      </div>
    </LayoutBase>
  );
}