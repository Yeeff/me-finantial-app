import React, { useState } from 'react';
import './CreatePersonModal.css';

const CreatePersonModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    identification: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Identification validation
    if (!formData.identification.trim()) {
      newErrors.identification = 'La identificación es obligatoria';
    }

    // Email validation (if provided)
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Ingresa un email válido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Only send non-empty fields
      const submitData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value.trim() !== '')
      );

      await onCreate(submitData);
      alert('✓ Persona creada exitosamente');
      // Success notification will be handled by parent
    } catch (error) {
      alert(`Error al crear persona: ${error.message}`);
      // Error handling will be done in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Check if form has data
    const hasData = Object.values(formData).some(value => value.trim() !== '');
    if (hasData) {
      if (window.confirm('¿Descartar cambios?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✕ CREAR NUEVA PERSONA</h2>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="person-form">
          <div className="form-group">
            <label htmlFor="name">Nombre completo *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Ingresa el nombre completo"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="identification">Identificación (CI/DNI) *</label>
            <input
              type="text"
              id="identification"
              name="identification"
              value={formData.identification}
              onChange={handleInputChange}
              className={errors.identification ? 'error' : ''}
              placeholder="Ingresa la identificación"
            />
            {errors.identification && <span className="error-message">{errors.identification}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Ingresa el teléfono"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="Ingresa el email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Dirección</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Ingresa la dirección"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notas (opcional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Información adicional sobre la persona..."
              rows="3"
            />
          </div>

          <div className="form-footer">
            <span className="required-note">* Campos obligatorios</span>
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creando...' : 'CREAR PERSONA'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePersonModal;