import React, { useState } from 'react';
import './LoanConfirmationModal.css';

const LoanConfirmationModal = ({ loanData, onClose, onGoToDashboard, onGoToDetail }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(loanData.link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      alert('Error al copiar el enlace');
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(loanData.accessCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      alert('Error al copiar el código');
    }
  };

  const handleShareWhatsApp = () => {
    const personName = loanData.person?.name || '';
    const message = `Hola ${personName}, aquí está el link para consultar tu préstamo: ${loanData.loan.accessLink}

Podrás ver el estado de tu deuda en tiempo real.`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleShareEmail = () => {
    const personName = loanData.person?.name || '';
    const subject = 'Consulta tu préstamo';
    const body = `Hola ${personName},

Aquí está el link para consultar tu préstamo:
${loanData.loan.accessLink}

Podrás ver el estado de tu deuda en tiempo real.

Saludos`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const handleShareSMS = () => {
    const personName = loanData.person?.name || '';
    const message = `Hola ${personName}, aquí está el link para consultar tu préstamo: ${loanData.loan.accessLink} Podrás ver el estado de tu deuda en tiempo real.`;
    const url = `sms:?body=${encodeURIComponent(message)}`;
    window.location.href = url;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✓ PRÉSTAMO CREADO EXITOSAMENTE</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="confirmation-body">
          <div className="success-message">
            <p>El préstamo de ${loanData.loan.initialCapital.toLocaleString('es-CO')} ha sido registrado exitosamente para:</p>
            <div className="person-summary">
              <span className="icon">👤</span>
              <div>
                <div className="person-name">{loanData.person.name}</div>
                <div className="person-id">🆔 CI: {loanData.person.identification}</div>
              </div>
            </div>
          </div>

          <div className="loan-details">
            <h3>📱 ENVÍA ESTE LINK AL PRESTATARIO:</h3>
            <div className="link-section">
              <div className="input-with-copy">
                <input
                  type="text"
                  value={loanData.loan.accessLink}
                  readOnly
                  className="readonly-input"
                />
                <button
                  className="copy-btn"
                  onClick={handleCopyLink}
                  title="Copiar enlace"
                >
                  {copiedLink ? '✓ Copiado' : '📋 Copiar'}
                </button>
              </div>
            </div>

            <div className="share-section">
              <p>Compartir por:</p>
              <div className="share-buttons">
                <button className="share-btn whatsapp" onClick={handleShareWhatsApp}>
                  WhatsApp
                </button>
                <button className="share-btn email" onClick={handleShareEmail}>
                  Email
                </button>
                <button className="share-btn sms" onClick={handleShareSMS}>
                  SMS
                </button>
              </div>
            </div>

            <div className="code-section">
              <p>────── O ──────</p>
              <p>Comparte este código de acceso:</p>
              <div className="input-with-copy">
                <input
                  type="text"
                  value={loanData.loan.accessCode}
                  readOnly
                  className="readonly-input code-input"
                />
                <button
                  className="copy-btn"
                  onClick={handleCopyCode}
                  title="Copiar código"
                >
                  {copiedCode ? '✓ Copiado' : '📋 Copiar'}
                </button>
              </div>
            </div>

            <div className="info-section">
              <p>ℹ️ El prestatario podrá consultar su préstamo en tiempo real con este link</p>
            </div>
          </div>

          <div className="sharing-section">
            <h3>Compartir vía:</h3>
            <div className="share-buttons">
              <button className="share-btn whatsapp" onClick={handleShareWhatsApp}>
                📱 WhatsApp
              </button>
              <button className="share-btn email" onClick={handleShareEmail}>
                ✉️ Email
              </button>
              <button className="share-btn sms" onClick={handleShareSMS}>
                💬 SMS
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="secondary-btn" onClick={onGoToDashboard || onClose}>
            Ir al dashboard
          </button>
          <button className="primary-btn" onClick={onGoToDetail || onClose}>
            Ver detalle del préstamo
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanConfirmationModal;