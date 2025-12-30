import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PersonCard.css';

const PersonCard = ({ person }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCardClick = () => {
    navigate(`/personas/${person.id}`);
  };

  return (
    <div className="person-card" onClick={handleCardClick}>
      <div className="person-card-header">
        <h3 className="person-name">{person.name}</h3>
        <span className="person-id">CI: {person.identification}</span>
      </div>

      <div className="person-card-info">
        {person.phone && (
          <div className="info-item">
            <span className="icon">📱</span>
            <span>{person.phone}</span>
          </div>
        )}
        {person.email && (
          <div className="info-item">
            <span className="icon">✉️</span>
            <span>{person.email}</span>
          </div>
        )}
      </div>

      <div className="person-card-loans">
        {person.activeLoansCount > 0 ? (
          <div className="loans-info">
            <span className="loans-text">
              Préstamos activos: {person.activeLoansCount} | Total adeudado: {formatCurrency(person.totalOwed)}
            </span>
          </div>
        ) : (
          <div className="no-loans">
            <span>Sin préstamos activos</span>
          </div>
        )}
      </div>

      <div className="person-card-action">
        <button className="view-detail-btn">
          Ver detalle →
        </button>
      </div>
    </div>
  );
};

export default PersonCard;