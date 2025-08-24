import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../fetchWithAuth';
import { useSession } from '../../SessionContext';
import LayoutBase from '../base/LayoutBaseUser';
import '../../styles/user/warranty.css';

const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

export default function Warranty() {
  const [formData, setFormData] = useState({
    customerID: '',
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
  const { onLogout } = useSession();

  // Fetch all main customers on component mount
  useEffect(() => {
    async function fetchMainCustomers() {
      try {
        const response = await fetchWithAuth(
          `${apiUrl}/api/adminGetMainCustomers/`,
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
          setMainCustomers(data);
        } else {
          console.error(data.message || 'Error fetching MainCustomers');
        }
      } catch {
        console.error('Error de conexión con el servidor');
      }
    }
    fetchMainCustomers();
  }, []);

  // Handle form field changes
  const handleChange = async ({ target: { name, value, files } }) => {
    if (name === 'invoiceNumber') {
      setFormData(f => ({ ...f, [name]: files[0] }));
    } else if (name === 'customerID') {
      // Correctly handle the customerID select
      setFormData(f => ({ ...f, [name]: value }));
      if (value) {
        // Fetch branch addresses when a customer is selected
        const [customerID, isRetail] = value.split('-');
        fetchBranchAddresses(customerID, isRetail);
      } else {
        setBranchAddresses([]);
      }
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
  };

  // Function to fetch branch addresses based on customer ID
  const fetchBranchAddresses = async (customerID, isRetail) => {
    try {
      const response = await fetchWithAuth(
        `${apiUrl}/api/getBranchAddresses/${customerID}/${isRetail}`,
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
        setBranchAddresses(data);
      } else {
        console.error(data.message || 'Error fetching branch addresses');
      }
    } catch {
      console.error('Error de conexión con el servidor');
    }
  };

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
          headers: {
            Authorization: `Bearer ${localStorage.getItem('session_token')}`
          },
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
          <label htmlFor="customerID">Compañía asociada:</label>
          <select
            id="customerID"
            name="customerID"
            value={formData.customerID}
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
          <label htmlFor="address">Dirección de la tienda:</label>
          <select
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            disabled={!formData.customerID}
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