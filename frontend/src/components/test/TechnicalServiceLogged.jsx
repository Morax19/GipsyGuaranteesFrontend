import React from 'react';
import '../../styles/technical_service/technicalService.css';
import LayoutBase from '../base/LayoutBaseUser';
import whatsappLogo from '../../assets/IMG/whatsapp.png';

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
  return (
    <LayoutBase activePage="user-technical-service">
    <div className="technical-service-container">
      <h2>Servicio Técnico</h2>
      <p>Para obtener información acerca de la(s) garantía(s) de su(s) producto(s), por favor contáctenos:</p>
      
      <br></br>
      <div className="branch-cards-container">
        {sucursalesData.map((sucursal) => (
          <div key={sucursal.id} className="branch-card-user">

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
    </LayoutBase>
  );
};

export default TechnicalService;