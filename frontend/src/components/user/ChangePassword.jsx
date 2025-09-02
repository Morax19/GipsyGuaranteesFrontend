import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getCurrentUserInfo } from '../../utils/getCurrentUser';
import '../../styles/user/changePassword.css';
import LayoutBase from '../base/LayoutBaseUser';
import eye from '../../assets/IMG/ojo.png';

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
  const [passwords, setPasswords] = useState({ oldPassword1: '', oldPassword2: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

    if (passwords.oldPassword1 !== passwords.oldPassword2) {
      setMessage('Las contraseñas actuales no coinciden. Por favor, verifique.');
      return;
    }

    try {
      const response = await fetchWithAuth(`${apiUrl}/api/userChangePassword/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID: user_id,
          old_password: passwords.oldPassword1,
          new_password: passwords.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Contraseña cambiada correctamente.');
        setPasswords({ oldPassword1: '', oldPassword2: '', newPassword: '' });
      } else {
        setMessage(data.warning);
      }
    } catch {
      setMessage('Error de conexión con el servidor.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LayoutBase activePage="change-password">
      <div className="cardContainerChangePassword">
        <h2>Cambiar contraseña</h2>
        <form onSubmit={handlePasswordSubmit}>
          <br />
          <div className="password-input-container">
            <label htmlFor="oldPassword1">Contraseña actual</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="oldPassword1"
              placeholder="Contraseña actual"
              value={passwords.oldPassword1}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={togglePasswordVisibility}
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <img src={eye} alt="Toggle password visibility" />
            </button>
            </div >
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              name="oldPassword2"
              placeholder="Confirmar contraseña"
              value={passwords.oldPassword2}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={togglePasswordVisibility}
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <img src={eye} alt="Toggle password visibility" />
            </button>
            </div >
            <br />
          <div className="password-input-container">
            <label htmlFor="newPassword">Contraseña nueva</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              placeholder="Nueva contraseña"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={togglePasswordVisibility}
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <img src={eye} alt="Toggle password visibility" />
            </button>
          </ div>
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
