/* Componente listo, NO TOCAR*/
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../styles/user/register.css';
import backIcon from '../../assets/IMG/back.png';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

// Regex para validar el formato de un correo electrónico.
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

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
    if (!emailRegex.test(form.EmailAddress)) {
        setMessage('El formato del correo electrónico no es válido. Por favor, ingresar una dirección usuario@dominio.com');
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
        alert('Se ha registrado exitosamente en Gipsy Garantías. Por favor, inicie sesión.');
        alert(data.message);
        navigate('/user/login'); // Redirect to login page
      } else {
        setMessage(data.warning);
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
          placeholder="Nombre *"
          required
          value={form.FirstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="LastName"
          placeholder="Apellido *"
          required
          value={form.LastName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="EmailAddress"
          placeholder="Correo Electrónico *"
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
        <div className="phone-container">
          <select className="phone-type" id="Phonetype" name="Phonetype">
            <option value="">Prefijo</option>
            <option value="0412">0412</option>
            <option value="0422">0422</option>
            <option value="0414">0414</option>
            <option value="0424">0424</option>
            <option value="0416">0416</option>
            <option value="0426">0426</option>
          </select>
          <input
            className="phone-number"
            type="number"
            id="Phone"
            name="Phone"
            placeholder="Número Telefónico"
            length="7"
          />
        </div>
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
          placeholder="Contraseña *"
          required
          value={form.Password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Contraseña *"
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