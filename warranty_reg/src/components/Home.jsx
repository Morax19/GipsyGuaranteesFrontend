import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../fetchWithAuth';
import { useSession } from '../SessionContext';
import '../styles/styles.css';

export default function Home() {
  const navigate = useNavigate();
  const { onLogout } = useSession();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('session_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWithAuth('http://localhost:8000/current_user/')
      .then(res => res.json())
      .then(setUser)
      .catch(() => setUser(null));
  }, [navigate]);

  return (
    <div className="menuContainer">
      <div className="menuBar">
          <button className="menuToggle" onClick={() => setMenuOpen(!menuOpen)}>
            &#128100;
          </button>
          {menuOpen && (
            <div className="menuDropdown">
              <button onClick={() => { setMenuOpen(false); navigate('/edit-profile'); }}>Editar perfil</button>
              <button onClick={onLogout}>Cerrar sesión</button>
            </div>
          )}
        </div>
        <div className="cardContainer">
          <h2>Bienvenido, {user ? user.firstName : ''}</h2>
          <p>¡Has iniciado sesión correctamente!</p>
          <div style={{ display: 'flex', gap: '12px', flexDirection: 'row' }}>
            <button className="appButton" onClick={() => navigate('/warranty')}>
              Registrar nueva garantía
            </button>
            {user && (user.is_staff || user.is_sudo) && (
              <button className="appButton" onClick={() => navigate('/servicio-tecnico')}>
                Servicio técnico
              </button>
            )}
          </div>
        </div>
    </div>
  );
}