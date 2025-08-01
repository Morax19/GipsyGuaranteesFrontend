import React, { useEffect } from 'react';
import '../../styles/technical_service/technicalService.css';
import { Link } from 'react-router-dom';
import backIcon from '../../assets/IMG/back.png';

const sucursalesData = [
  {
    id: 1,
    nombreEmpresa: 'Gipsy Garantías - Principal Caracas',
    direccion: 'Av. Libertador, Edificio Principal, Piso 2, Caracas',
    telefono: '+58 212-666-6666',
    diaAtencion: 'Lunes a Viernes',
    horarioAtencion: '10:00 AM - 7:00 PM',
  },
  {
    id: 2,
    nombreEmpresa: 'Gipsy Garantías - Sucursal Este',
    direccion: 'Centro Comercial Sambil, Nivel Terraza, Local 150, Caracas Este',
    telefono: '+58 212-666-6666',
    diaAtencion: 'Lunes a Sábado',
    horarioAtencion: '10:00 AM - 7:00 PM',
  },
  {
    id: 3,
    nombreEmpresa: 'Gipsy Garantías - Sucursal Oeste',
    direccion: 'Avenida Sucre, Edificio Miranda, Planta Baja, Los Dos Caminos',
    telefono: '+58 212-666-6666',
    diaAtencion: 'Lunes a Viernes',
    horarioAtencion: '8:30 AM - 4:30 PM',
  },
];

const TechnicalService = () => {
  /* Añade y elimina la barra curva de la parte inferior */
  useEffect(() => {
    document.body.classList.add('barraCurvaServTec');

    return () => {
      document.body.classList.remove('barraCurvaServTec');
    };
  }, []);

  return (
    <div className="technical-service-container">
      <div className="back-link-container">
        <Link to="/">
          <img src={backIcon} alt="Volver" className="back-icon" />
        </Link>
      </div>

      <h2>Servicio Técnico</h2>
      <p>Sucursales disponibles para la atención del control de su(s) garantía(s)</p>
      
      <br></br>
      <div className="branch-cards-container">
        {sucursalesData.map((sucursal) => (
          <div key={sucursal.id} className="branch-card">
            <div className="branch-card-info">
              <div className="branch-card-title">{sucursal.nombreEmpresa}</div>
              <div>{sucursal.direccion}</div>
              <div>Teléfono: {sucursal.telefono}</div>
            </div>
            <div className="branch-card-schedule">
              <div className="branch-card-title">Horario de Atención</div>
              <div>{sucursal.diaAtencion}</div>
              <div>{sucursal.horarioAtencion}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalService;