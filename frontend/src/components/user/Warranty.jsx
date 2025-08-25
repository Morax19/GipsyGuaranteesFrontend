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
    barCode: '',
    purchaseDate: '',
    storeName: '',
    storeAddress: '',
    invoiceNumber: null,
    StoreID: '',
    NroFactura: '',
    MarcaProducto: '',
    ModeloProducto: '',
  });

  const [mainCustomers, setMainCustomers] = useState([]);
  const [branchAddresses, setBranchAddresses] = useState([]);

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
  const handleChange = async ({ target: { name, value, files } }) => {
    if (name === 'invoiceNumber') {
      setFormData(f => ({ ...f, [name]: files[0] }));
    } else if (name === 'mainCustomerID') {
      // Correctly handle the mainCustomerID select
      setFormData(f => ({ ...f, [name]: value }));
      if (value) {
        // Fetch branch addresses when a customer is selected
        const [mainCustomerID, isRetail] = value.split('-');
        fetchBranchAddresses(mainCustomerID, isRetail);
      } else {
        setBranchAddresses([]);
      }
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
  };

  useEffect(() => {
    fetchMainCustomers();
  }, []);

  // Submit warranty registration
  const handleSubmit = async e => {
    e.preventDefault();

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
          {/* Customer Select List */}
          <label htmlFor="mainCustomerID">Compañía asociada:</label>
          <select
            id="mainCustomerID"
            name="mainCustomerID"
            value={`${formData.mainCustomerID}-${mainCustomers.find(c => c.ID === formData.mainCustomerID)?.isRetail || ''}`}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Tienda donde compró el producto</option>
            {mainCustomers.map(mainCustomer => (
              <option key={`${mainCustomer.ID}-${mainCustomer.isRetail}`} value={`${mainCustomer.ID}-${mainCustomer.isRetail}`}>
                {mainCustomer.FullName}
              </option>
            ))}
          </select>

          {/* Branch Address Select List */}
          <label htmlFor="storeAddress">Dirección de la tienda:</label>
          <select
            id="storeAddress"
            name="storeAddress"
            required
            value={formData.storeAddress}
            onChange={handleChange}
            disabled={!formData.mainCustomerID}
          >
            <option value="" disabled>Seleccione una dirección</option>
            {branchAddresses.map((address, idx) => (
              <option key={idx} value={address}>{address}</option>
            ))}
          </select>
          
          {/* Other Form Fields */}
          <label htmlFor="StoreID">RIF de la tienda:</label>
          <input
            type="text"
            id="StoreID"
            name="StoreID"
            placeholder="RIF de la tienda"
            required
            value={formData.StoreID}
            onChange={handleChange}
          />
          <label htmlFor="purchaseDate">Fecha de compra:</label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            required
            value={formData.purchaseDate}
            onChange={handleChange}
          />
          <label htmlFor="NroFactura">Número de Factura:</label>
          <input
            type="text"
            id="NroFactura"
            name="NroFactura"
            placeholder="Número de Factura"
            required
            value={formData.NroFactura}
            onChange={handleChange}
          />
          <label htmlFor="MarcaProducto">Marca del producto:</label>
          <input
            type="text"
            id="MarcaProducto"
            name="MarcaProducto"
            placeholder="Marca del producto"
            required
            value={formData.MarcaProducto}
            onChange={handleChange}
          />
          <label htmlFor="ModeloProducto">Modelo del producto:</label>
          <input
            type="text"
            id="ModeloProducto"
            name="ModeloProducto"
            placeholder="Modelo del producto"
            required
            value={formData.ModeloProducto}
            onChange={handleChange}
          />
          <label htmlFor="barCode">Código de Barras:</label>
          <input
            type="text"
            id="barCode"
            name="barCode"
            placeholder="Código de Barras"
            required
            value={formData.barCode}
            onChange={handleChange}
          />
          <label htmlFor="invoiceNumber">Factura del producto:</label>
          <input
            type="file"
            id="invoiceNumber"
            name="invoiceNumber"
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