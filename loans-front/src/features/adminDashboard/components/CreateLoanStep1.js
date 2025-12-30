import React from 'react';
import PersonSelector from './PersonSelector';
import './CreateLoanStep1.css';

const CreateLoanStep1 = ({ onPersonSelected, onCancel }) => {
  return (
    <div className="create-loan-step1">
      <div className="step-indicator">
        <h2>NUEVO PRÉSTAMO - Paso 1 de 2</h2>
        <div className="progress-circles">
          <span className="circle active">●</span>
          <span className="circle">○</span>
        </div>
        <p className="step-subtitle">Seleccionar persona</p>
      </div>

      <PersonSelector
        onPersonSelect={onPersonSelected}
        onCancel={onCancel}
      />
    </div>
  );
};

export default CreateLoanStep1;