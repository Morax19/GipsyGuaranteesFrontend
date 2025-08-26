/* Este componente esta listo NO TOCAR */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../styles/user/login.css';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

function Login() {
  /* Añade y elimina la barra curva de la parte inferior */
  useEffect(() => {
    document.body.classList.add('barraCurvaLogin');

    return () => {
      document.body.classList.remove('barraCurvaLogin');
    };
  }, []);

  const [EmailAddress, setEmailAddress] = useState('');
  const [Password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/userLogin/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ EmailAddress, Password }),
      });

      const data = await response.json();
      if (response.ok) {
        const { access_token } = data;
        sessionStorage.setItem('session_token', access_token);
        navigate('/user/home');
      }
      else {
        alert(data.detail || data.message || data.error || 'Login failed');
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="cardContainerLogin">
      <img src={logo} alt="Logo" className="logoLogin" />
      <h2>Iniciar sesión como <br/> Cliente</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="EmailAddress"
          placeholder="Correo electrónico"
          required
          value={EmailAddress}
          onChange={e => setEmailAddress(e.target.value)}
        />
        <br />
        <input
          type="password"
          name="Password"
          placeholder="Contraseña"
          required
          value={Password}
          onChange={e => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>
        ¿No tienes una cuenta? <a href="#" onClick={e => { e.preventDefault(); navigate('/user/register/'); }}>Regístrate</a>
      </p>
      {/*
      <p>
        <a href="#" disabled onClick={e => { e.preventDefault(); navigate('/user/forgot-password/'); }}>¿Olvidaste tu contraseña?</a>
      </p>
      */}

      <div className="login-footer">
        <Link to="/technical-service/login" className="login-link"> 
          Soy Servicio Técnico
        </Link>
        <br />
        <Link to="/admin/login" className="login-link"> 
          Soy Administrador
        </Link>
      </div>
    </div>
  );
}

export default Login;