import React, { useState } from 'react';
import api from '../../../services/api';

const NewLoanForm = ({ onClose, onSuccess }) => {
  const [person, setPerson] = useState({ name: '', identification: '', phone: '', email: '', address: '' });
  const [loan, setLoan] = useState({ initialCapital: '', interestRate: '', interestType: 'MONTHLY', startDate: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create person
      const personResponse = await api.post('/persons', person);
      const personId = personResponse.data.id;

      // Create loan
      const loanData = {
        personId,
        initialCapital: parseFloat(loan.initialCapital),
        interestRate: parseFloat(loan.interestRate),
        interestType: loan.interestType,
        startDate: loan.startDate
      };
      await api.post('/loans', null, { params: loanData });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating loan:', error);
      alert('Error creating loan');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Nuevo Préstamo</h2>
        <form onSubmit={handleSubmit}>
          <h3>Datos de la Persona</h3>
          <input type="text" placeholder="Nombre" value={person.name} onChange={(e) => setPerson({...person, name: e.target.value})} required />
          <input type="text" placeholder="Identificación" value={person.identification} onChange={(e) => setPerson({...person, identification: e.target.value})} required />
          <input type="text" placeholder="Teléfono" value={person.phone} onChange={(e) => setPerson({...person, phone: e.target.value})} />
          <input type="email" placeholder="Email" value={person.email} onChange={(e) => setPerson({...person, email: e.target.value})} />
          <input type="text" placeholder="Dirección" value={person.address} onChange={(e) => setPerson({...person, address: e.target.value})} />

          <h3>Datos del Préstamo</h3>
          <input type="number" placeholder="Capital Inicial" value={loan.initialCapital} onChange={(e) => setLoan({...loan, initialCapital: e.target.value})} required />
          <input type="number" step="0.01" placeholder="Tasa de Interés" value={loan.interestRate} onChange={(e) => setLoan({...loan, interestRate: e.target.value})} required />
          <select value={loan.interestType} onChange={(e) => setLoan({...loan, interestType: e.target.value})}>
            <option value="MONTHLY">Mensual</option>
            <option value="ANNUAL">Anual</option>
          </select>
          <input type="date" value={loan.startDate} onChange={(e) => setLoan({...loan, startDate: e.target.value})} required />

          <button type="submit">Crear Préstamo</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default NewLoanForm;