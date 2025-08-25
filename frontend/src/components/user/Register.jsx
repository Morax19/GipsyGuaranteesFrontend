/* Componente listo, NO TOCAR*/
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../styles/user/register.css';
import backIcon from '../../assets/IMG/back.png';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : process.env.VITE_API_BASE_URL_PROD;

function Register() {
    /* Añade y elimina la barra curva de la parte inferior */
    useEffect(() => {
      document.body.classList.add('barraCurvaURegister');
  
      return () => {
        document.body.classList.remove('barraCurvaURegister');
      };
    }, []);

  const [form, setForm] = useState({
    FirstName: '',
    LastName: '',
    EmailAddress: '',
    PhoneNumber: '',
    Address: '',
    Zip: '',
    Password: '',
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
    if (form.Password !== form.confirmPassword) {
      alert('Las contraseñas deben coincidir.');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/api/publicRegister/`, {
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
        navigate('/user/login'); // Redirect to login page
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
        <Link to="/user/login">
          <img src={backIcon} alt="Volver" className="back-icon" />
        </Link>
      </div>
      <img src={logo} alt="Logo" className="logoURegister" />
      <h2>Registro de usuario</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="FirstName"
          placeholder="Nombre"
          required
          value={form.FirstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="LastName"
          placeholder="Apellido"
          required
          value={form.LastName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="EmailAddress"
          placeholder="Email"
          required
          value={form.EmailAddress}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Address"
          placeholder="Dirección (Opcional)"
          value={form.Address}
          onChange={handleChange}
        />
        <input
        type="tel"
        name="PhoneNumber"
        placeholder="Teléfono (Opcional)"
        value={form.PhoneNumber}
        onChange={handleChange}          
        />
        <input
          type="text"
          name="Zip"
          placeholder="Código Postal (Opcional)"
          value={form.zip_code}
          onChange={handleChange}
        />
        <input
          type="password"
          name="Password"
          placeholder="Contraseña"
          required
          value={form.Password}
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