import React from 'react';

const LoanList = ({ loans, onVerDetalle, onRegistrarPago, onEnviarLink }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  };

  return (
    <div className="loans-list">
      <h2>📋 PRÉSTAMOS ACTIVOS</h2>
      {loans.filter(loan => loan.status === 'ACTIVE').map(loan => {
        const interests = parseFloat(loan.totalDebt) - parseFloat(loan.currentCapital);
        return (
          <div key={loan.id} className="loan-item">
            <div className="loan-info">
              <p><strong>{loan.person.name} - CI: {loan.person.identification}</strong></p>
              <p>Capital: {formatCurrency(loan.currentCapital)}</p>
              <p>Intereses: {formatCurrency(interests)} (calculado)</p>
              <p>Total: {formatCurrency(loan.totalDebt)}</p>
            </div>
            <div className="loan-actions">
              <button onClick={() => onVerDetalle(loan.id)}>Ver detalle</button>
              <button onClick={() => onRegistrarPago(loan.id)}>Registrar pago</button>
              <button onClick={() => onEnviarLink(loan.id)}>Enviar link</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LoanList;