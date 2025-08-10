/* Componente listo, NO TOCAR*/
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../styles/user/register.css';
import backIcon from '../../assets/IMG/back.png';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

function Register() {
    /* Añade y elimina la barra curva de la parte inferior */
    useEffect(() => {
      document.body.classList.add('barraCurvaURegister');
  
      return () => {
        document.body.classList.remove('barraCurvaURegister');
      };
    }, []);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (form.password !== form.confirmPassword) {
      alert('Las contraseñas deben coincidir.');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/submitRegistration/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        alert('Registration successful!');
        navigate('/login'); // Redirect to login page
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      console.log(apiUrl);
      setMessage('Error connecting to server: ' + error.message);
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="cardContainerURegister">
      <div className="back-link-container">
        <Link to="/login">
          <img src={backIcon} alt="Volver" className="back-icon" />
        </Link>
      </div>
      <img src={logo} alt="Logo" className="logoURegister" />
      <h2>Registro de usuario</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="Nombre"
          required
          value={form.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Apellido"
          required
          value={form.lastName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección (Opcional)"
          value={form.address}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          required
          value={form.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Contraseña"
          required
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Registrarse</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;