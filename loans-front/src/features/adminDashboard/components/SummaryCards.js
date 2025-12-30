import React from 'react';

const SummaryCards = ({ loans }) => {
  const totalLent = loans.reduce((sum, loan) => sum + parseFloat(loan.currentCapital), 0);
  const totalToCollect = loans.reduce((sum, loan) => sum + parseFloat(loan.totalOwed), 0);
  const totalInterest = totalToCollect - totalLent;
  const activeCount = loans.length;

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  return (
    <div className="summary-cards">
      {/* Tarjeta 1: Total Prestado */}
      <div className="card card-blue">
        <p className="card-label">Total Prestado</p>
        <p className="card-value">{formatCurrency(totalLent)}</p>
        <div className="card-icon">💵</div>
      </div>

      {/* Tarjeta 2: Total a Cobrar */}
      <div className="card card-green">
        <p className="card-label">Total a Cobrar</p>
        <p className="card-value">{formatCurrency(totalToCollect)}</p>
        <p className="card-sublabel">+{formatCurrency(totalInterest)} en intereses</p>
      </div>

      {/* Tarjeta 3: Préstamos Activos */}
      <div className="card card-purple">
        <p className="card-label">Préstamos Activos</p>
        <p className="card-value">{activeCount}</p>
        <div className="card-icon">📋</div>
      </div>
    </div>
  );
};

export default SummaryCards;