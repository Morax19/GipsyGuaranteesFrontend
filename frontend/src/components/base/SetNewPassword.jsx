import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
    const [showConfirmedPassword, setShowConfirmedPassword] =useState(false);

    const [Code, setCode] = useState('');
    const [showCode, setShowCode] = useState(false);

    const [showCodeOrPassword, setShowCodeOrPassword] = useState(true); // true for code, false for password

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
    const handleConfirmedPasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmedPasswordVisibility = () => {
        setShowConfirmedPassword(!showConfirmedPassword);
    };

    const toggleCodeVisibility = () => {
        setShowCode(!showCode);
    };

    // Maneja el submit del formulario de código; el formulario tiene dos botones submit
    // El submitter se identifica por e.nativeEvent.submitter.name -> 'verify' | 'resend'
    const handleCodeFormSubmit = async (e) => {
        e.preventDefault();
        const submitterName = e.nativeEvent?.submitter?.name;
        setMessage('');
        if (submitterName === 'verify') {
            // Validar código localmente contra el temp_password decodificado
            if (!Code) {
                setMessage('Ingrese el código.');
                return;
            }
            if (Code.trim() === String(tokenTempPassword).trim()) {
                // Código correcto: mostrar la lógica de cambio de contraseña
                setShowCodeOrPassword(false);
                setMessage('Código verificado. Ahora puede establecer una nueva contraseña.');
            } else {
                setMessage('Código inválido. Verifique e intente nuevamente.');
            }
            return;
        }

        if (submitterName === 'resend') {
            // Reenviar/solicitar nuevo código al backend (mantener comportamiento previo)
            setLoading(true);
            try {
                const response = await fetch(`${apiUrl}/api/forgottenPassword/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: tokenEmailAddress })
                });
                const data = await response.json();
                if (response.ok) {
                    setMessage(data.message || 'Código reenviado.');
                } else {
                    setMessage(data.message || 'Error al reenviar el código.');
                }
            } catch (err) {
                setMessage('Error de red al reenviar el código.');
            } finally {
                setLoading(false);
            }
        }
    };

    // Maneja el submit del formulario de cambio de contraseña
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        // Validaciones locales
        if (!passwords.newPassword || !passwords.confirmNewPassword) {
            setMessage('Complete ambos campos de contraseña.');
            return;
        }
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            setMessage('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            // Nota: asumo un endpoint para cambiar la contraseña. Ajustar según backend.
            const tempToken = localStorage.getItem('temp_token');
            const response = await fetch(`${apiUrl}/api/resetPassword/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: tokenUserId,
                    new_password: passwords.newPassword,
                    temp_token: tempToken
                })
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message || 'Contraseña actualizada correctamente.');
                localStorage.removeItem('temp_token');
                // Opcional: redirigir al login después de un corto delay
                setTimeout(() => navigate('/'), 1200);
            } else {
                setMessage(data.error || 'Error al actualizar la contraseña.');
            }
        } catch (err) {
            setMessage('Error de red al actualizar la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cardContainerFPassword">
            <img src={logo} alt="Logo" className="logoFPassword" />
            {showCodeOrPassword ? (
                <React.Fragment>
                    <h2>Ingrese el código de verificación</h2>
                    <br />
                    <form onSubmit={handleCodeFormSubmit}>
                        <div className="fPassword-input-container centered-input-container">
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
                                className="fPassword-toggle-button"
                                onClick={toggleCodeVisibility}
                                title={showCode ? "Ocultar código" : "Mostrar código"}
                            >
                                <img src={eye} alt="Toggle code visibility" />
                            </button>
                            </div>
                        <br />
                        <div className="fPassword-button-group tight-button-group">
                        <button type="submit" name="verify" disabled={loading}>
                            {loading ? 'Verificando' : 'Verificar'}
                        </button>
                        <button type="submit" name="resend" disabled={loading}>
                            {loading ? 'Enviando' : 'Reenviar código'}
                        </button>
                        </div>
                    </form>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <h2>Establecer nueva contraseña</h2>
                    <br />
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="fPassword-input-container centered-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                placeholder="Nueva contraseña"
                                required
                                value={passwords.newPassword}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                className="fPassword-toggle-button"
                                onClick={togglePasswordVisibility}
                                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                <img src={eye} alt="Toggle Password visibility" />
                            </button>
                        </div>
                        <div className="fPassword-input-container centered-input-container">
                            <input
                                type={showConfirmedPassword ? "text" : "password"}
                                name="confirmNewPassword"
                                placeholder="Confirmar nueva contraseña"
                                required
                                value={passwords.confirmNewPassword}
                                onChange={handleConfirmedPasswordChange}
                            />
                            <button
                                type="button"
                                className="fPassword-toggle-button"
                                onClick={toggleConfirmedPasswordVisibility}
                                title={showConfirmedPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                <img src={eye} alt="Toggle Password visibility" />
                            </button>
                        </div>
                        <br />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Enviando' : 'Cambiar contraseña'}
                        </button>
                    </form>
                </React.Fragment>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default SetNewPassword;
