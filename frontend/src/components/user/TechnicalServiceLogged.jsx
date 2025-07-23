import React from 'react';
import '../../styles/technical_service/technicalService.css';
import LayoutBase from '../base/LayoutBaseUser';

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
  return (
    <LayoutBase activePage="user-technical-service">
    <div className="technical-service-container">
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
    </LayoutBase>
  );
};

export default TechnicalService;