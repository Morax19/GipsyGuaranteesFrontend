import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../styles/admin/LoginAdmin.css';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';
import eye from '../../assets/IMG/ojo.png';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

function LoginAdmin() {
  /* Añade y elimina la barra curva de la parte inferior */
  useEffect(() => {
    document.body.classList.add('barraCurvaLoginAdmin');

    return () => {
      document.body.classList.remove('barraCurvaLoginAdmin');
    };
  }, []);

  const [EmailAddress, setEmailAddress] = useState('');
  const [Password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/adminLogin/`, {
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
        navigate('/admin/home');
      } else {
        alert(data.warning);
      }
    } catch (error) {
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cardContainerLoginAdmin">
      <img src={logo} alt="Logo" className="logoLoginAdmin" />
      <h2>Iniciar sesión como <br/> Administrador</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="EmailAddress"
          placeholder="Correo Electrónico"
          required
          value={EmailAddress}
          onChange={e => setEmailAddress(e.target.value)}
        />
        <br />
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            name="Password"
            placeholder="Contraseña"
            required
            value={Password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle-button"
            onClick={togglePasswordVisibility}
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            <img src={eye} alt="Toggle password visibility" />
          </button>
        </div>
        <br />
        <button className="submit-button-admin" type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>
      
      <p>
        <a href="#" onClick={e => { e.preventDefault(); navigate('/admin/forgot-password'); }}>¿Olvidaste tu contraseña?</a>
      </p>

      <div className="login-footer">
        <Link to="/user/login" className="login-link"> 
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