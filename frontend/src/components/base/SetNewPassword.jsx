import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { getTempToken } from '../../utils/passwordRecovery';
import '../../styles/base/setNewPassword.css';
import logo from '../../assets/IMG/Gipsy_imagotipo_color.png';
import eye from '../../assets/IMG/ojo.png';

const isDevelopment = import.meta.env.MODE === 'development'
const apiUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;

const SetNewPassword = () => {
    const navigate = useNavigate();
    
    const [tokenUserId, setTokenUserId] = useState(null);
    const [tokenUserFirstName, setTokenUserFirstName] = useState('');
    const [tokenEmailAddress, setTokenEmailAddress] = useState('');
    const [tokenTempPassword, setTokenTempPassword] = useState('');
    const [tokenRole, setTokenRole] = useState(null);
    
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [passwords, setPasswords] = useState({ newPassword: '', confirmNewPassword: ''});
    const [showPassword, setShowPassword] =useState(false);

    const [Code, setCode] = useState('');
    const [showCode, setShowCode] = useState(false);

    useEffect(() => {
        document.body.classList.add('barraCurvaFPassword');

        return () => {
            document.body.classList.remove('barraCurvaFPassword');
        };
    }, []);

    useEffect(() => {
        const tokenData = getTempToken();
        if (!tokenData) {
            navigate('/', { replace: true });
            return;
        }
        const { user_id, user_first_name, email_address, temp_password, role } = tokenData;
        setTokenUserId(user_id);
        setTokenUserFirstName(user_first_name);
        setTokenEmailAddress(email_address);
        setTokenTempPassword(temp_password);
        setTokenRole(role);
    }, [navigate]);



    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleCodeVisibility = () => {
        setShowCode(!showCode);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const response = await fetchWithAuth(`${apiUrl}/api/userRecoverPassword/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //body: JSON.stringify({ email }),
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
        <img src={logo} alt="Logo" className="logoFPassword" />
        <h2>Ingrese el código de verificación</h2>
        <br />
        <form onSubmit={handleSubmit}>
        <div className="password-input-container">
            <input
            type={showCode ? "text" : "password"}
            name="Code"
            placeholder="Código de Verificación"
            required
            value={Code}
            onChange={e => setCode(e.target.value)}
            />
            <button
            type="button"
            className="password-toggle-button"
            onClick={toggleCodeVisibility}
            title={showCode ? "Ocultar código" : "Mostrar código"}
            >
            <img src={eye} alt="Toggle code visibility" />
            </button>
        {/*
        <div className="password-input-container">
            <input
            type={showPassword ? "text" : "password"}
            name="NewPassword1"
            placeholder="Nueva contraseña"
            required
            value={passwords.newPassword}
            onChange={e => setNewPassword(e.target.value)}
            />
            <button
            type="button"
            className="password-toggle-button"
            onClick={togglePasswordVisibility}
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
            <img src={eye} alt="Toggle Password visibility" />
            </button>
        </div>
        <div className="password-input-container">
            <input
            type={showPassword ? "text" : "password"}
            name="NewPassword2"
            placeholder="Confirmar nueva contraseña"
            required
            value={NewPassword}
            onChange={e => setNewPassword(e.target.value)}
            />
            <button
            type="button"
            className="password-toggle-button"
            onClick={togglePasswordVisibility}
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
            <img src={eye} alt="Toggle Password visibility" />
            </button>
        </div>
            */}
        </div>
        <br />
        <button type="submit" disabled={loading}>
            {loading ? 'Verificando' : 'Verificar'}
        </button>
        </form>
        {message && <p>{message}</p>}
    </div>
    );
};

export default SetNewPassword;
