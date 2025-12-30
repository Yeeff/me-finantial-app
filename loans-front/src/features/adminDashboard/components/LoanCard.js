import React from 'react';
import './LoanCard.css';

const LoanCard = ({ loan, onViewDetail, onRegisterPayment, onSendLink }) => {
  // Determinar indicador de antigüedad
  const getAgeIndicator = (days) => {
    if (days <= 30) return { emoji: '🔴', color: 'border-red-500', bg: 'bg-red-50' };
    if (days <= 90) return { emoji: '🟡', color: 'border-yellow-500', bg: 'bg-yellow-50' };
    return { emoji: '🟠', color: 'border-orange-500', bg: 'bg-orange-50' };
  };

  const indicator = getAgeIndicator(loan.daysAccrued || 0);

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toLocaleString('es-CO')}`;
  };

  return (
    <div className={`loan-card ${indicator.color} ${indicator.bg}`}>
      {/* Header */}
      <div className="loan-header">
        <div className="loan-person">
          <div className="person-indicator">
            <span className="indicator-emoji">{indicator.emoji}</span>
            <h3 className="person-name">{loan.person.name}</h3>
          </div>
          <p className="person-id">CI: {loan.person.identification}</p>
        </div>
      </div>

      {/* Información financiera */}
      <div className="loan-financial">
        <div className="financial-row">
          <span className="label">Capital actual:</span>
          <span className="value">{formatCurrency(loan.currentCapital)}</span>
        </div>
        <div className="financial-row">
          <span className="label">Intereses ({loan.daysAccrued || 0} días):</span>
          <span className="value interest-value">
            {formatCurrency(loan.accruedInterest)}
          </span>
        </div>
        <hr className="financial-divider" />
        <div className="financial-row total-row">
          <span className="label total-label">TOTAL ADEUDADO:</span>
          <span className="value total-value">
            {formatCurrency(loan.totalOwed)}
          </span>
        </div>
      </div>

      {/* Info adicional */}
      <div className="loan-info">
        Tasa: {loan.interestRate}% {loan.interestType === 'MONTHLY' ? 'mensual' : 'anual'} |
        Inicio: {new Date(loan.startDate).toLocaleDateString('es-CO')}
      </div>

      {/* Botones */}
      <div className="loan-actions">
        <button
          onClick={() => onViewDetail(loan.id)}
          className="action-btn btn-secondary"
        >
          Ver detalle
        </button>
        <button
          onClick={() => onRegisterPayment(loan.id)}
          className="action-btn btn-primary"
        >
          Registrar pago
        </button>
        <button
          onClick={() => onSendLink(loan.accessLink)}
          className="action-btn btn-secondary"
        >
          Enviar link
        </button>
      </div>
    </div>
  );
};

export default LoanCard;