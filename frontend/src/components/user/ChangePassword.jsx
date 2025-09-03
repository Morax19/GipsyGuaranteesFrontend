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
  const [passwords, setPasswords] = useState({ oldPassword1: '', oldPassword2: '', newPassword: '', newPassword2: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] = useState(false);

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

    if (passwords.newPassword !== passwords.newPassword2) {
      setMessage('Las contraseñas nuevas no coinciden. Por favor, verifique.');
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
        setPasswords({ oldPassword1: '', oldPassword2: '', newPassword: '', newPassword2: '' });
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

  const togglePasswordConfirmationVisibility = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleNewPasswordConfirmationVisibility = () => {
    setShowNewPasswordConfirmation(!showNewPasswordConfirmation);
  };

  return (
    <LayoutBase activePage="change-password">
      <div className="cardContainerChangePassword">
        <h2>Cambiar contraseña</h2>
        <form onSubmit={handlePasswordSubmit}>
          <br /><br />
          <label htmlFor="oldPassword1">
              Contraseña actual <span className="required-asterisk">*</span>
          </label>
          <div className="changePassword-input-container small-margin">
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
              className="changePassword-toggle-button"
              onClick={togglePasswordVisibility}
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <img src={eye} alt="Toggle password visibility" />
            </button>
          </div>
          <div className="changePassword-input-container small-margin">
            <input
              type={showPasswordConfirmation ? 'text' : 'password'}
              name="oldPassword2"
              placeholder="Confirmar contraseña"
              value={passwords.oldPassword2}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className="changePassword-toggle-button"
              onClick={togglePasswordConfirmationVisibility}
              title={showPasswordConfirmation ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <img src={eye} alt="Toggle password visibility" />
            </button>
          </div>
          <br />
          <label htmlFor="newPassword">
              Contraseña nueva <span className="required-asterisk">*</span>
          </label>
          <div className="changePassword-input-container small-margin">
            <input
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              placeholder="Nueva contraseña"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className="changePassword-toggle-button"
              onClick={toggleNewPasswordVisibility}
              title={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <img src={eye} alt="Toggle password visibility" />
            </button>
          </div>
          <div className="changePassword-input-container small-margin">
            <input
              type={showNewPasswordConfirmation ? 'text' : 'password'}
              name="newPassword2"
              placeholder="Confirmar nueva contraseña"
              value={passwords.newPassword2}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className="changePassword-toggle-button"
              onClick={toggleNewPasswordConfirmationVisibility}
              title={showNewPasswordConfirmation ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <img src={eye} alt="Toggle password visibility" />
            </button>
          </div>
          <div className="ButtonGroupChangePassword">
            <button className="savePassword-button" type="submit">Guardar contraseña</button>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </LayoutBase>
  );
};

export default ChangePassword;
