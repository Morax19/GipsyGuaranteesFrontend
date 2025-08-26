import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import '../../styles/user/editProfile.css';
import LayoutBase from '../base/LayoutBaseUser';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;


const EditProfile = () => {

  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      alert('Por favor, inicie sesión para acceder a esta página.');
      navigate('/user/login');
      return null;
    }
  }, [navigate]);

  const {user_id, email_address, role } = getCurrentUserInfo();
  const [form, setForm] = useState({
    userID: user_id,
    FirstName: '',
    LastName: '',
    EmailAddress: '',
    PhoneNumber: '',
    Address: '',
    Zip: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      navigate('/');
      return;
    } else {
      fetchWithAuth(`${apiUrl}/api/getCustomerByUserID/?userID=${user_id}`)
        .then(res => res.json())
        .then(data => setForm(prev => ({ ...prev, ...data })))
        .catch(() =>
          setForm({
            userID: user_id,
            FirstName: '',
            LastName: '',
            EmailAddress: '',
            PhoneNumber: '',
            Address: '',
            Zip: ''
          })
        );
    }
  }, [navigate, user_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetchWithAuth(`${apiUrl}/api/userProfileEdit/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Perfil actualizado correctamente.');
      } else {
        setMessage(data.error || 'Error al actualizar el perfil.');
      }
    } catch (error) {
      setMessage('Error de conexión con el servidor.');
    }
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
          <div className="ButtonGroupEditProfile">
            <button type="submit">Guardar cambios</button>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </LayoutBase>
  );
};

export default EditProfile;