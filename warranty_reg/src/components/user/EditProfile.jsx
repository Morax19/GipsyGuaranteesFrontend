import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../fetchWithAuth';
import SessionModal from "../base/SessionModal";
import { useSessionTimeout } from '../../useSessionTimeout';
import '../../styles/user/editProfile.css';
import LayoutBase from '../base/LayoutBaseUser';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';

const apiUrl = import.meta.env.VITE_API_DEV_URL;

const EditProfile = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', address: '' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('session_token');
    if (!token) {
      //DESCOMENTAR ESTO AL TERMINAR DE AÑADIR ESTILOS
      //navigate('/login');
      return;
    }
    fetchWithAuth(`${apiUrl}/current_user/`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser({ firstName: '', lastName: '', email: '', address: '' }));
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('session_token');
    try {
      const response = await fetchWithAuth(`${apiUrl}/edit_profile/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('session_token');
    try {
      const response = await fetchWithAuth(`${apiUrl}/changePassword/`, {
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
      navigate('/login');
    };

    const [showSessionModal, setShowSessionModal] = useSessionTimeout(handleLogout);

  return (
    <LayoutBase activePage="edit-profile">
    <div className="cardContainerEditProfile">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="Nombre"
          value={user.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Apellido"
          value={user.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={user.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={user.address || ''}
          onChange={handleChange}
        />
      </form>
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
        <div className="ButtonGroupEditProfile">
          <button type="submit">Guardar contraseña</button>
          <button type="submit">Guardar cambios</button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
    </LayoutBase>
  );
};

export default EditProfile;
