/* Este componente esta listo NO TOCAR */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import logo from '../assets/IMG/Gipsy_imagotipo_color.png';

function Login() {
  /* Añade y elimina la barra curva de la parte inferior */
  useEffect(() => {
    document.body.classList.add('barraCurva');

    return () => {
      document.body.classList.remove('barraCurva');
    };
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to home page
    if (localStorage.getItem('session_token')) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/login/', {
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
        navigate('/');
      } else {
        alert(data.detail || data.message || 'Login failed');
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="cardContainer">
      <img src={logo} alt="Logo" className="logo" />
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>
        ¿No tienes una cuenta? <a href="#" onClick={e => { e.preventDefault(); navigate('/register/'); }}>Regístrate</a>
      </p>
      <p>
        <a href="#" onClick={e => { e.preventDefault(); navigate('/forgot-password/'); }}>¿Olvidaste tu contraseña?</a>
      </p>
    </div>
  );
}

export default Login;