import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../styles/admin/LoginAdmin.css';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';

const apiUrl = import.meta.env.VITE_API_DEV_URL;

function LoginAdmin() {
  /* Añade y elimina la barra curva de la parte inferior */
  useEffect(() => {
    document.body.classList.add('barraCurvaLoginAdmin');

    return () => {
      document.body.classList.remove('barraCurvaLoginAdmin');
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
      const response = await fetch(`${apiUrl}/technical-service/login`, {
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
    <div className="cardContainerLoginAdmin">
      <img src={logo} alt="Logo" className="logoLoginAdmin" />
      <Link to="/admin/home" className="no-underline-link"> 
          <h2>Iniciar sesión como <br/> Administrador</h2>
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
        <a href="#" onClick={e => { e.preventDefault(); navigate('/admin/forgot-password'); }}>¿Olvidaste tu contraseña?</a>
      </p>

      <div className="login-footer">
        <Link to="/login" className="login-link"> 
          Soy Cliente
        </Link>
        <br />
        <Link to="/technical-service/login" className="login-link"> 
          Soy Servicio Técnico
        </Link>
      </div>
    </div>
  );
}

export default LoginAdmin;