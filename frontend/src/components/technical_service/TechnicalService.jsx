import React, { useState, useEffect } from 'react';
import '../../styles/technical_service/technicalService.css';
import { Link } from 'react-router-dom';
import backIcon from '../../assets/IMG/back.png';

const sucursalesData = [
  {
    id: 1,
    nombreEmpresa: 'Call Center - Garantías Gipsy',
    telefono: '+58 422-6247117',
    diaAtencion: 'Lunes a Viernes',
    horarioAtencion: '9:00 AM - 5:00 PM'
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
      <p>Para obtener información acerca de la(s) garantía(s) de su(s) producto(s), por favor contáctenos:</p>
      
      <br></br>
      <div className="branch-cards-container">
        {sucursalesData.map((sucursal) => (
          <div key={sucursal.id} className="branch-card">
            <div className="branch-card-info">
              <div className="branch-card-title">{sucursal.nombreEmpresa}</div>           
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