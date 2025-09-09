import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import '../../styles/technical_service/forgotPasswordTechnicalService.css';
import backIcon from '../../assets/IMG/back.png';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

const ForgotPasswordTechnicalService = () => {
  /* Añade y elimina la barra curva de la parte inferior */
  useEffect(() => {
    document.body.classList.add('barraCurvaFPasswordTechnicalService');

    return () => {
      document.body.classList.remove('barraCurvaFPasswordTechnicalService');
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
      const response = await fetchWithAuth(`${apiUrl}/api/forgottenPassword/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        const { temp_token } = data;
        localStorage.setItem('temp_token', temp_token);
        setMessage(data.message);
      } else {
        setMessage(data.warning);
      }
    } catch (error) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cardContainerFPasswordTechnicalService">
      <div className="back-link-container">
        <Link to="/technical-service/login">
          <img src={backIcon} alt="Volver" className="back-icon" />
        </Link>
      </div>
      <img src={logo} alt="Logo" className="logoFPasswordTechnicalService" />
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

export default ForgotPasswordTechnicalService;
