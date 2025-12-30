import React, { useState } from 'react';
import CreateLoanStep1 from './CreateLoanStep1';
import CreateLoanStep2 from './CreateLoanStep2';
import LoanConfirmationModal from './LoanConfirmationModal';
import api from '../../../services/api';
import './CreateLoanModal.css';

const CreateLoanModal = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [createdLoan, setCreatedLoan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePersonSelected = (person) => {
    setSelectedPerson(person);
    setCurrentStep(2);
  };

  const handleLoanConfigured = async (data) => {
    setLoanData(data);
    setLoading(true);
    try {
      const response = await api.post('/loans', {
        personId: data.person.id,
        initialCapital: data.initialCapital,
        interestRate: data.interestRate,
        interestType: data.interestType,
        startDate: data.startDate,
        notes: data.notes
      });
      setCreatedLoan(response.data);
      if (onSuccess) onSuccess();
      setCurrentStep(3);
    } catch (error) {
      console.error('Error creating loan:', error);
      alert('Error al crear el préstamo. Verifica los datos e intenta nuevamente');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CreateLoanStep1 onPersonSelected={handlePersonSelected} onCancel={handleClose} />;
      case 2:
        return (
          <CreateLoanStep2
            selectedPerson={selectedPerson}
            onLoanConfigured={handleLoanConfigured}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <LoanConfirmationModal
            loanData={{
              loan: createdLoan,
              person: selectedPerson
            }}
            onClose={handleClose}
            onGoToDashboard={handleClose}
            onGoToDetail={() => {/* TODO: navigate to detail */}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {loading && <div className="loading">Creando préstamo...</div>}
        {!loading && renderStep()}
      </div>
    </div>
  );
};

export default CreateLoanModal;