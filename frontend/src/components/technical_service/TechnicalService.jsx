import React, { useState, useEffect } from 'react';
import '../../styles/technical_service/technicalService.css';
import { Link } from 'react-router-dom';
import backIcon from '../../assets/IMG/back.png';
import whatsappLogo from '../../assets/IMG/whatsapp.png'

const sucursalesData = [
  {
    id: 1,
    nombreEmpresa: 'Call Center - Garantías',
    telefono: '+58 422-6247117',
    diaAtencion: 'Lunes a Viernes',
    horarioAtencion: '9:00 AM - 5:00 PM',
    correo: 'info@garantiasservicio.com',
    whatsappLink: 'https://wa.me/584226247117?text=Hola,%20quisiera%20consultar%20sobre%20una%20garantía.',
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

            <a 
              href={sucursal.whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="whatsapp-icon-container"
              title="Iniciar chat de WhatsApp"
            >
                <img src={whatsappLogo} alt="WhatsApp Logo" className="whatsapp-logo" />
            </a>

            <div className="branch-card-info">
              <div className="branch-card-title">{sucursal.nombreEmpresa}</div>           
              <div>Teléfono: {sucursal.telefono}</div>
              <div className="contact-email">
                Correo electrónico: 
                <a 
                  href={`mailto:${sucursal.correo}?subject=Consulta%20de%20Servicio%20de%20Garantías`}
                  className="email-link"
                >
                  {sucursal.correo}
                </a>
              </div>
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