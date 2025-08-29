import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import '../../styles/user/changePassword.css';
import LayoutBase from '../base/LayoutBaseUser';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

const ChangePassword = () => {

  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem('session_token')) {
      alert('Por favor, inicie sesión para acceder a esta página.');
      navigate('/user/login');
      return null;
    }
  }, [navigate]);

  const {user_id, user_first_name, email_address, role} = getCurrentUserInfo();
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!user_id) {
      setMessage('No se pudo obtener el usuario actual.');
      return;
    }

    try {
      const response = await fetchWithAuth(`${apiUrl}/api/userChangePassword/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID: user_id,
          old_password: passwords.oldPassword,
          new_password: passwords.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Contraseña cambiada correctamente.');
        setPasswords({ oldPassword: '', newPassword: '' });
      } else {
        setMessage(data.warning);
      }
    } catch {
      setMessage('Error de conexión con el servidor.');
    }
  };

  return (
    <LayoutBase activePage="change-password">
      <div className="cardContainerChangePassword">
        <h2>Cambiar contraseña</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            name="oldPassword"
            placeholder="Contraseña actual"
            value={passwords.oldPassword}
            onChange={handlePasswordChange}
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="Nueva contraseña"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            required
          />
          <div className="ButtonGroupChangePassword">
            <button type="submit">Guardar contraseña</button>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </LayoutBase>
  );
};

export default ChangePassword;
