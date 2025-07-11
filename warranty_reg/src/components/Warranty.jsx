import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../fetchWithAuth';
import { useSession } from '../SessionContext';
import LayoutBase from './LayoutBase';
import '../styles/warranty.css';

export default function Warranty() {
  const navigate = useNavigate();
  const { onLogout } = useSession();
  const [form, setForm]       = useState({
    barCode: '',
    purchaseDate: '',
    storeName: '',
    storeAddress: '',
    invoiceNumber: null
  });

  // Redirect if no token present
/* Deshabilitado el redirect a login si no hay sesión iniciada

  useEffect(() => {
    if (!localStorage.getItem('session_token')) {
      navigate('/login');
    }
  }, [navigate]);
*/

  // Handle form field changes
  const handleChange = ({ target: { name, value, files } }) => {
    if (name === 'invoiceNumber') {
      setForm(f => ({ ...f, invoiceNumber: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Submit warranty registration
  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    try {
      const response = await fetchWithAuth(
        'http://localhost:8000/registerWarranty/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('session_token')}`
          },
          body: formData
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log('¡Garantía guardada exitosamente!');
        // reset form or redirect here if desired
      } else {
        console.log(data.message || 'Error al guardar la garantía');
      }
    } catch {
      console.log('Error de conexión con el servidor');
    }
  };

  return (
    <LayoutBase activePage="warranty">
    <div className="cardContainerWarranty">
      <h2>Registro de Garantía</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="storeName"></label>
        <select
          id="storeName"
          name="storeName"
          required
          value={form.storeName}
          onChange={handleChange}
        >
          <option value="">Tienda donde compró el producto</option>
          <option value="StoreA">Opción 1</option>
          <option value="StoreB">Opción 2</option>
          <option value="StoreC">Opción 3</option>
        </select>

        <label htmlFor="storeAddress"></label>
        <select
          id="storeAddress"
          name="storeAddress"
          required
          value={form.storeAddress}
          onChange={handleChange}
        >
          <option value="">Dirección de la tienda</option>
          <option value="StoreA">Dirección 1</option>
          <option value="StoreB">Dirección 2</option>
          <option value="StoreC">Dirección 3</option>
        </select>

        <label htmlFor="StoreID"></label>
        <input
          type="text"
          id="StoreID"
          name="StoreID"
          placeholder="RIF de la tienda"
          required
          value={form.StoreID}
          onChange={handleChange}
        />

        <label htmlFor="purchaseDate">Fecha de compra:</label>
        <input
          type="date"
          id="purchaseDate"
          name="purchaseDate"
          required
          value={form.purchaseDate}
          onChange={handleChange}
        />

        <label htmlFor="NroFactura"></label>
        <input
          type="text"
          id="NroFactura"
          name="NroFactura"
          placeholder="Número de Factura"
          required
          value={form.NroFactura}
          onChange={handleChange}
        />

        <label htmlFor="MarcaProducto"></label>
        <input
          type="text"
          id="MarcaProducto"
          name="MarcaProducto"
          placeholder="Marca del producto"
          required
          value={form.MarcaProducto}
          onChange={handleChange}
        />

        <label htmlFor="ModeloProducto"></label>
        <input
          type="text"
          id="ModeloProducto"
          name="ModeloProducto"
          placeholder="Modelo del producto"
          required
          value={form.ModeloProducto}
          onChange={handleChange}
        />
        
        <label htmlFor="barCode"></label>
        <input
          type="text"
          id="barCode"
          name="barCode"
          placeholder="Código de Barras"
          required
          value={form.barCode}
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