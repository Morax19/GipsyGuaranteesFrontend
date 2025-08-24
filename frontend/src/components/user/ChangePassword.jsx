import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../fetchWithAuth';
import SessionModal from "../base/SessionModal";
import { useSessionTimeout } from '../../useSessionTimeout';
import '../../styles/user/changePassword.css';
import LayoutBase from '../base/LayoutBaseUser';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : process.env.VITE_API_BASE_URL_PROD;

const ChangePassword = () => {

  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('session_token');
    if (!token) {
      //DESCOMENTAR ESTO AL TERMINAR DE AÑADIR ESTILOS
      //navigate('/user/login');
      return;
    }
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('session_token');
    try {
      const response = await fetchWithAuth(`${apiUrl}/api/userChangePassword/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: user.email,
          old_password: passwords.oldPassword,
          new_password: passwords.newPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Contraseña cambiada correctamente.');
        setPasswords({ oldPassword: '', newPassword: '' });
      } else {
        setMessage(data.message || 'Error al cambiar la contraseña.');
      }
    } catch (error) {
      setMessage('Error de conexión con el servidor.');
    }
  };

  const handleLogout = () => {
      localStorage.removeItem('session_token');
      localStorage.removeItem('refresh_token');
      navigate('/user/login');
    };

    const [showSessionModal, setShowSessionModal] = useSessionTimeout(handleLogout);

  return (
    <LayoutBase activePage="change-password">
    <div className="cardContainerChangePassword">
      <h2>Cambiar contraseña</h2>
      <br />
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
