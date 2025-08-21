/* Este componente esta listo NO TOCAR */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../styles/technical_service/loginTechnicalService.css';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : process.env.VITE_API_BASE_URL_PROD;

function LoginTechnicalService() {
  /* Añade y elimina la barra curva de la parte inferior */
  useEffect(() => {
    document.body.classList.add('barraCurvaLoginTechnicalService');

    return () => {
      document.body.classList.remove('barraCurvaLoginTechnicalService');
    };
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to home page
    if (localStorage.getItem('session_token')) {
      navigate('/technical-service/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/technicalServicesLogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok && data.access) {
        localStorage.setItem('session_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        navigate('/technical-service/home');
      } else {
        alert(data.detail || data.message || 'Login failed');
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="cardContainerLoginTechnicalService">
      <img src={logo} alt="Logo" className="logoLoginTechnicalService" />
      <Link to="/technical-service/home" className="no-underline-link"> 
          <h2>Iniciar sesión como <br/> Servicio Técnico</h2>
      </Link>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>
        <a href="#" onClick={e => { e.preventDefault(); navigate('/technical-service/forgot-password/'); }}>¿Olvidaste tu contraseña?</a>
      </p>

      <div className="login-footer">
        <Link to="/user/login" className="login-link"> 
          Soy Cliente
        </Link>
        <br />
        <Link to="/admin/login" className="login-link"> 
          Soy Administrador
        </Link>
      </div>
    </div>
  );
}

export default LoginTechnicalService;