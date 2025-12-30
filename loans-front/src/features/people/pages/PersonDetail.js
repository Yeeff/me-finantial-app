import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePeople from '../hooks/usePeople';
import './PersonDetail.css';

const PersonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPerson, getPersonLoans } = usePeople();

  const [person, setPerson] = useState(null);
  const [loans, setLoans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        setLoading(true);
        const [personData, loansData] = await Promise.all([
          getPerson(id),
          getPersonLoans(id)
        ]);
        setPerson(personData);
        setLoans(loansData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error loading person details');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [id, getPerson, getPersonLoans]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="person-detail-page">
        <div className="loading">Cargando detalles de la persona...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="person-detail-page">
        <div className="error">
          Error: {error}
          <button onClick={() => navigate('/personas')} className="back-btn">
            ← Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="person-detail-page">
        <div className="error">
          Persona no encontrada
          <button onClick={() => navigate('/personas')} className="back-btn">
            ← Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  const activeLoans = loans?.activeLoans || [];
  const paidLoans = loans?.paidLoans || [];

  const totalCurrentCapital = activeLoans.reduce((sum, loan) => sum + loan.currentCapital, 0);
  const totalAccruedInterest = activeLoans.reduce((sum, loan) => sum + loan.accruedInterest, 0);
  const totalOwed = activeLoans.reduce((sum, loan) => sum + loan.totalOwed, 0);

  return (
    <div className="person-detail-page">
      <div className="detail-header">
        <button
          className="back-btn"
          onClick={() => navigate('/personas')}
        >
          ← Volver
        </button>
        <div className="header-actions">
          <button className="edit-btn">Editar</button>
          <button className="new-loan-btn">Nuevo Préstamo</button>
        </div>
      </div>

      <div className="person-info-section">
        <h1 className="person-name">👤 {person.name}</h1>

        <div className="person-info-card">
          <div className="info-row">
            <span className="info-label">🆔 Identificación:</span>
            <span className="info-value">{person.identification}</span>
          </div>
          {person.phone && (
            <div className="info-row">
              <span className="info-label">📱 Teléfono:</span>
              <span className="info-value">{person.phone}</span>
            </div>
          )}
          {person.email && (
            <div className="info-row">
              <span className="info-label">✉️ Email:</span>
              <span className="info-value">{person.email}</span>
            </div>
          )}
          {person.address && (
            <div className="info-row">
              <span className="info-label">📍 Dirección:</span>
              <span className="info-value">{person.address}</span>
            </div>
          )}
          {person.notes && (
            <div className="info-row">
              <span className="info-label">📝 Notas:</span>
              <span className="info-value">{person.notes}</span>
            </div>
          )}
          <div className="info-row">
            <span className="info-label">📅 Registrado:</span>
            <span className="info-value">{formatDate(person.createdAt)}</span>
          </div>
        </div>
      </div>

      {activeLoans.length > 0 && (
        <>
          <div className="loans-section">
            <h2 className="section-title">💰 PRÉSTAMOS ({activeLoans.length})</h2>

            {activeLoans.map(loan => (
              <div key={loan.id} className="loan-card active">
                <div className="loan-status">🔴 ACTIVO</div>
                <div className="loan-details">
                  <div className="loan-row">
                    <span>Capital: {formatCurrency(loan.currentCapital)}</span>
                  </div>
                  <div className="loan-row">
                    <span>Intereses: {formatCurrency(loan.accruedInterest)} ({loan.daysAccrued} días)</span>
                  </div>
                  <div className="loan-row total">
                    <span>Total adeudado: {formatCurrency(loan.totalOwed)}</span>
                  </div>
                  <div className="loan-row">
                    <span>Inicio: {formatDate(loan.startDate)} | Tasa: {loan.interestRate}% mensual</span>
                  </div>
                </div>
                <div className="loan-actions">
                  <button className="loan-action-btn">Ver detalle</button>
                  <button className="loan-action-btn primary">Pagar</button>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-section">
            <h2 className="section-title">📊 RESUMEN</h2>
            <div className="summary-card">
              <div className="summary-row">
                <span>Total prestado actualmente: {formatCurrency(totalCurrentCapital)}</span>
              </div>
              <div className="summary-row">
                <span>Total a cobrar hoy: {formatCurrency(totalOwed)}</span>
              </div>
              <div className="summary-row">
                <span>Intereses acumulados: {formatCurrency(totalAccruedInterest)}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {paidLoans.length > 0 && (
        <div className="paid-loans-section">
          <h2 className="section-title">💵 HISTORIAL DE PRÉSTAMOS PAGADOS ({paidLoans.length})</h2>

          {paidLoans.map(loan => (
            <div key={loan.id} className="loan-card paid">
              <div className="loan-status">✓ PAGADO</div>
              <div className="loan-details">
                <div className="loan-row">
                  <span>Capital inicial: {formatCurrency(loan.initialCapital)}</span>
                </div>
                <div className="loan-row">
                  <span>Pagado totalmente el: {formatDate(loan.paidDate)}</span>
                </div>
              </div>
              <div className="loan-actions">
                <button className="loan-action-btn">Ver detalle</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeLoans.length === 0 && paidLoans.length === 0 && (
        <div className="no-loans-message">
          <p>Esta persona no tiene préstamos registrados</p>
          <button className="new-loan-btn">Crear nuevo préstamo</button>
        </div>
      )}
    </div>
  );
};

export default PersonDetail;