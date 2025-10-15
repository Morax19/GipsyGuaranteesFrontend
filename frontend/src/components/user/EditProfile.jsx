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

  const {user_id, user_first_name, email_address, role} = getCurrentUserInfo();
  const [form, setForm] = useState({
    userID: user_id,
    FirstName: '',
    LastName: '',
    NationalIDtype: '',
    NationalID: '',
    EmailAddress: '',
    Phonetype: '', // prefix
    PhoneNumber: '', // number only
    Address: '',
    Zip: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      navigate('/');
      return;
    } else {
      fetchWithAuth(`${apiUrl}/api/getCustomerByUserID/?userID=${user_id}`)
        .then(res => res.json())
        .then(data => {
          let prefix = '';
          let number = '';
          if (data.PhoneNumber) {
            const parts = data.PhoneNumber.split('-');
            if (parts.length === 2) {
              prefix = parts[0];
              number = parts[1];
            }
          }
          
          let nationalIDtype = '';
          let nationalID = '';
          if (data.NationalId) {
            const parts2 = data.NationalId.split('-');
            if (parts2.length === 2) {
              nationalIDtype = parts2[0];
              nationalID = parts2[1];
            }
          }

          setForm(prev => ({
            ...prev,
            ...data,
            NationalIDtype: nationalIDtype,
            NationalID: nationalID,
            Phonetype: prefix,
            PhoneNumber: number
          }));
        })
        .catch(() =>
          setForm({
            userID: user_id,
            FirstName: '',
            LastName: '',
            NationalIDtype: '',
            NationalID: '',
            EmailAddress: '',
            Phonetype: '',
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
    setLoading(true);
    setMessage('');
    // Concatenate prefix and number for backend
    const submitForm = {
      ...form,
      NationalID: `${form.NationalIDtype}-${form.NationalID}`,
      PhoneNumber: `${form.Phonetype}-${form.PhoneNumber}`
    };
    try {
      const response = await fetchWithAuth(`${apiUrl}/api/userProfileEdit/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitForm)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Perfil actualizado correctamente.');
      } else {
        setMessage(data.warning);
      }
    } catch (error) {
      setMessage('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
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
          <div className="national-id-container">
          <select className="national-id-type" id="NationalIDtype" name="NationalIDtype" value={form.NationalIDtype} onChange={handleChange} required>
            <option value="">Prefijo</option>
            <option value="V">V</option>
            <option value="E">E</option>
            <option value="P">P</option>
            <option value="J">J</option>
            <option value="G">G</option>
            <option value="R">R</option>
          </select>
          <input
              className="national-id"
              type="tel"
              id="NationalID"
              name="NationalID"
              placeholder="Cédula de identidad *"
              value={form.NationalID}
              onChange={handleChange}
              required
            />
          </div>
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
          <div className="phone-container">
            <select className="phone-type" id="Phonetype" name="Phonetype" value={form.Phonetype} onChange={handleChange} required>
              <option value="">Prefijo</option>
              <option value="0412">0412</option>
              <option value="0422">0422</option>
              <option value="0414">0414</option>
              <option value="0424">0424</option>
              <option value="0416">0416</option>
              <option value="0426">0426</option>
              <option value="0212">0212</option>
            </select>
            <input
              className="phone-number"
              type="tel"
              id="PhoneNumber"
              name="PhoneNumber"
              placeholder="Número Telefónico"
              maxLength={7}
              value={form.PhoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="text"
            name="Zip"
            placeholder="Código Postal (Opcional)"
            value={form.Zip}
            onChange={handleChange}
          />
          <div className="ButtonGroupEditProfile">
            <button type="submit" disabled={loading}>
              {loading ? 'Cargando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </LayoutBase>
  );
};

export default EditProfile;