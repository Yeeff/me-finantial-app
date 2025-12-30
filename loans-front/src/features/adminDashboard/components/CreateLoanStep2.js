import React, { useState, useEffect } from 'react';
import './CreateLoanStep2.css';

const CreateLoanStep2 = ({ selectedPerson, onLoanConfigured, onBack }) => {
  const [formData, setFormData] = useState({
    amount: '',
    interestRate: '',
    interestType: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState({});
  const [formattedAmount, setFormattedAmount] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'El monto es obligatorio';
    }
    if (!formData.interestRate || parseFloat(formData.interestRate) <= 0) {
      newErrors.interestRate = 'La tasa debe ser mayor a cero';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es obligatoria';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePreview = () => {
    const amount = parseFloat(formData.amount) || 0;
    const rate = parseFloat(formData.interestRate) || 0;
    const type = formData.interestType;

    let dailyRate;
    if (type === 'MONTHLY') {
      dailyRate = rate / 100 / 30;
    } else {
      dailyRate = rate / 100 / 365;
    }

    const interestIn30Days = amount * dailyRate * 30;

    setPreview({
      capital: amount.toLocaleString('es-CO'),
      rateText: `${rate}% ${type === 'MONTHLY' ? 'mensual' : 'anual'} (${(dailyRate * 100).toFixed(3)}% diario)`,
      interest30Days: interestIn30Days.toLocaleString('es-CO')
    });
  };

  useEffect(() => {
    calculatePreview();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      // Remove non-numeric characters for storage
      const numericValue = value.replace(/[^\d]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      // Format for display
      setFormattedAmount(numericValue ? parseInt(numericValue).toLocaleString('es-CO') : '');
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBack = () => {
    if (window.confirm('¿Descartar información del préstamo?')) {
      if (onBack) onBack();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const loanData = {
        person: selectedPerson,
        initialCapital: parseFloat(formData.amount),
        interestRate: parseFloat(formData.interestRate),
        interestType: formData.interestType,
        startDate: formData.startDate,
        notes: formData.notes
      };
      onLoanConfigured(loanData);
    }
  };

  return (
    <div className="create-loan-step2">
      <div className="step-indicator">
        <h2>NUEVO PRÉSTAMO - Paso 2 de 2</h2>
        <div className="progress-circles">
          <span className="circle">○</span>
          <span className="circle active">●</span>
        </div>
        <p className="step-subtitle">Configurar préstamo</p>
      </div>

      <div className="selected-person">
        <div className="person-badge">
          <span className="icon">👤</span>
          <div>
            <div className="person-name">{selectedPerson.name}</div>
            <div className="person-id">CI: {selectedPerson.identification}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="loan-form">
        <div className="form-group">
          <label htmlFor="amount">Monto a prestar *</label>
          <div className="input-with-symbol">
            <span>$</span>
            <input
              type="text"
              id="amount"
              name="amount"
              value={formattedAmount}
              onChange={handleChange}
              placeholder="10000000"
              required
            />
          </div>
          <small>Ej: 10000000 (sin puntos ni comas)</small>
          {errors.amount && <span className="error">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="interestRate">Tasa de interés *</label>
          <div className="interest-inputs">
            <input
              type="number"
              id="interestRate"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="10"
              required
            />
            <span>%</span>
            <select
              id="interestType"
              name="interestType"
              value={formData.interestType}
              onChange={handleChange}
            >
              <option value="MONTHLY">Mensual</option>
              <option value="ANNUAL">Anual</option>
            </select>
          </div>
          <small>Ej: 10 (significa 10% mensual)</small>
          {errors.interestRate && <span className="error">{errors.interestRate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Fecha de inicio *</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          {formData.startDate === new Date().toISOString().split('T')[0] && <small>← Hoy</small>}
          {errors.startDate && <span className="error">{errors.startDate}</span>}
        </div>

        {formData.amount && formData.interestRate && (
          <div className="preview-section">
            <h3>💡 Vista previa del cálculo:</h3>
            <div className="preview-card">
              <p>Capital prestado: ${preview.capital}</p>
              <p>Tasa: {preview.rateText}</p>
              <p>En 30 días generará: ${preview.interest30Days}</p>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="notes">Notas (opcional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Ej: Préstamo para negocio de ropa"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleBack} className="back-btn">← Atrás</button>
          <button type="submit" className="submit-btn">CREAR PRÉSTAMO</button>
        </div>
      </form>
    </div>
  );
};

export default CreateLoanStep2;