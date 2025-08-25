import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import '../../styles/user/editProfile.css';
import LayoutBase from '../base/LayoutBaseUser';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : process.env.VITE_API_BASE_URL_PROD;

const EditProfile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ FirstName: '', LastName: '', EmailAddress: '', PhoneNumber: '', Address: '',  Zip: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      navigate('/');
      return;
    } else {
      fetchWithAuth(`${apiUrl}/api/currentUser/`)
      .then(res => res.json())
      .then(data => setForm(data))
      .catch(() => setForm({ FirstName: '', LastName: '', EmailAddress: '', PhoneNumber: '', Address: '', Zip: '' }));
    }
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetchWithAuth(`${apiUrl}/userProfileEdit/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('session_token')}`,
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Perfil actualizado correctamente.');
      } else {
        setMessage(data.message || 'Error al actualizar el perfil.');
      }
    } catch (error) {
      setMessage('Error de conexión con el servidor.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('session_token');
    navigate('/');
  };

  return (
    <LayoutBase activePage="edit-profile">
    <div className="cardContainerEditProfile">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="FirstName"
          placeholder="Nombre"
          required
          value={form.FirstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="LastName"
          placeholder="Apellido"
          required
          value={form.LastName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="EmailAddress"
          placeholder="Email"
          required
          value={form.EmailAddress}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Address"
          placeholder="Dirección (Opcional)"
          value={form.Address}
          onChange={handleChange}
        />
        <input
        type="tel"
        name="PhoneNumber"
        placeholder="Teléfono (Opcional)"
        value={form.PhoneNumber}
        onChange={handleChange}          
        />
        <input
          type="text"
          name="Zip"
          placeholder="Código Postal (Opcional)"
          value={form.Zip}
          onChange={handleChange}
        />
      </form>
        <div className="ButtonGroupEditProfile">
          <button type="submit">Guardar cambios</button>
        </div>
      {message && <p>{message}</p>}
    </div>
    </LayoutBase>
  );
};

export default EditProfile;