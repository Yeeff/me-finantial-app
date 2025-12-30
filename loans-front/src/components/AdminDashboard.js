import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState('');
  const [summary, setSummary] = useState({ totalPrestado: 0, totalCobrar: 0, activeLoans: 0 });

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get('/loans');
      const loansData = response.data;
      setLoans(loansData);

      // Calculate summary
      let totalPrestado = 0;
      let totalCobrar = 0;
      let activeCount = 0;

      loansData.forEach(loan => {
        if (loan.status === 'ACTIVE') {
          totalPrestado += parseFloat(loan.initialCapital);
          totalCobrar += parseFloat(loan.totalDebt);
          activeCount++;
        }
      });

      setSummary({ totalPrestado, totalCobrar, activeLoans: activeCount });
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  };

  const handleVerDetalle = (loanId) => {
    alert(`Ver detalle del préstamo ${loanId}`);
  };

  const handleRegistrarPago = (loanId) => {
    alert(`Registrar pago para préstamo ${loanId}`);
  };

  const handleEnviarLink = (loanId) => {
    alert(`Enviar link para préstamo ${loanId}`);
  };

  const handleNuevoPrestamo = () => {
    alert('Nuevo préstamo');
  };

  const filteredLoans = loans.filter(loan =>
    loan.person.name.toLowerCase().includes(search.toLowerCase()) ||
    loan.person.identification.includes(search)
  );

  return (
    <div className="admin-dashboard">
      <header>
        <h1>💰 Sistema de Préstamos</h1>
        <span>[Admin: Carlos]</span>
      </header>

      <div className="summary">
        <h2>📊 RESUMEN GENERAL</h2>
        <div className="summary-cards">
          <div className="card">
            <h3>Total Prestado</h3>
            <p>{formatCurrency(summary.totalPrestado)}</p>
          </div>
          <div className="card">
            <h3>Total a Cobrar</h3>
            <p>{formatCurrency(summary.totalCobrar)}</p>
          </div>
          <div className="card">
            <h3>Préstamos Activos</h3>
            <p>{summary.activeLoans}</p>
          </div>
        </div>
      </div>

      <div className="search">
        <h2>🔍 Buscar persona o préstamo...</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
        />
      </div>

      <div className="loans-list">
        <h2>📋 PRÉSTAMOS ACTIVOS</h2>
        {filteredLoans.filter(loan => loan.status === 'ACTIVE').map(loan => {
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
                <button onClick={() => handleVerDetalle(loan.id)}>Ver detalle</button>
                <button onClick={() => handleRegistrarPago(loan.id)}>Registrar pago</button>
                <button onClick={() => handleEnviarLink(loan.id)}>Enviar link</button>
              </div>
            </div>
          );
        })}
      </div>

      <button className="new-loan-btn" onClick={handleNuevoPrestamo}>+ NUEVO PRÉSTAMO</button>
    </div>
  );
};

export default AdminDashboard;