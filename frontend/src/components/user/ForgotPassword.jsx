import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../fetchWithAuth';
import '../../styles/user/forgotPassword.css';
import backIcon from '../../assets/IMG/back.png';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : process.env.VITE_API_BASE_URL_PROD;

const ForgotPassword = () => {
  /* Añade y elimina la barra curva de la parte inferior */
  useEffect(() => {
    document.body.classList.add('barraCurvaFPassword');

    return () => {
      document.body.classList.remove('barraCurvaFPassword');
    };
  }, []);

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetchWithAuth(`${apiUrl}/forgotPassword/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`,
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message || 'Error sending reset email');
      }
    } catch (error) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cardContainerFPassword">
      <div className="back-link-container">
        <Link to="/login">
          <img src={backIcon} alt="Volver" className="back-icon" />
        </Link>
      </div>
      <img src={logo} alt="Logo" className="logoFPassword" />
      <h2>Recuperar Contraseña</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar correo'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
