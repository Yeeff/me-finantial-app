import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import './PersonSelector.css'; // Assuming we'll create this

const PersonSelector = ({ onPersonSelect, onCreatePerson, onCancel }) => {
  const [recentPeople, setRecentPeople] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPersonData, setNewPersonData] = useState({ name: '', identification: '', phone: '' });
  const [creating, setCreating] = useState(false);

  // Fetch recent people on mount
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoading(true);
        const response = await api.get('/people/recent');
        setRecentPeople(response.data);
      } catch (error) {
        console.error('Error fetching recent people:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery.trim());
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms debounce
    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = async (query) => {
    try {
      setLoading(true);
      const response = await api.get('/people/search', { params: { search: query } });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching people:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonSelect = (person) => {
    setSelectedPerson(person);
  };

  const handleContinue = () => {
    if (selectedPerson && onPersonSelect) {
      onPersonSelect(selectedPerson);
    }
  };

  const handleCancel = () => {
    if (selectedPerson) {
      if (window.confirm('¿Cancelar creación del préstamo?')) {
        if (onCancel) onCancel();
      }
    } else {
      if (onCancel) onCancel();
    }
  };

  const handleCreatePersonClick = () => {
    setShowCreateForm(true);
  };

  const handleCreatePersonSubmit = async () => {
    if (!newPersonData.name || !newPersonData.identification) {
      alert('Nombre e identificación son obligatorios');
      return;
    }
    setCreating(true);
    try {
      const response = await api.post('/people', newPersonData);
      const newPerson = response.data;
      setSelectedPerson(newPerson);
      setShowCreateForm(false);
      setNewPersonData({ name: '', identification: '', phone: '' });
    } catch (error) {
      console.error('Error creating person:', error);
      alert('Error al crear la persona');
    } finally {
      setCreating(false);
    }
  };

  const handleCreatePersonCancel = () => {
    setShowCreateForm(false);
    setNewPersonData({ name: '', identification: '', phone: '' });
  };

  const displayedPeople = searchQuery ? searchResults : recentPeople;

  return (
    <div className="person-selector">
      <div className="question">¿A quién le vas a prestar?</div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre o identificación..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <div className="loading">Cargando...</div>}

      <div className="people-list">
        {displayedPeople.length === 0 && searchQuery && !loading && (
          <div className="no-results">
            No se encontraron personas con ese criterio
            <button onClick={handleCreatePersonClick} className="create-btn">
              + Crear nueva persona
            </button>
          </div>
        )}
        {displayedPeople.map((person) => (
          <div
            key={person.id}
            className={`person-item ${selectedPerson?.id === person.id ? 'selected' : ''}`}
            onClick={() => handlePersonSelect(person)}
          >
            <input
              type="radio"
              name="person"
              value={person.id}
              checked={selectedPerson?.id === person.id}
              onChange={() => handlePersonSelect(person)}
            />
            <div className="person-info">
              <div className="person-name">{person.name}</div>
              <div className="person-identification">CI: {person.identification}</div>
              <div className="person-loans">
                {person.activeLoansCount > 0 ? `Préstamos activos: ${person.activeLoansCount}` : 'Sin préstamos activos'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showCreateForm && (
        <div className="create-person">
          <button onClick={handleCreatePersonClick} className="create-btn">
            + Crear nueva persona
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className="create-person-form">
          <h3>Crear nueva persona:</h3>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={newPersonData.name}
              onChange={(e) => setNewPersonData({ ...newPersonData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Identificación:</label>
            <input
              type="text"
              value={newPersonData.identification}
              onChange={(e) => setNewPersonData({ ...newPersonData, identification: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Teléfono (opcional):</label>
            <input
              type="text"
              value={newPersonData.phone}
              onChange={(e) => setNewPersonData({ ...newPersonData, phone: e.target.value })}
            />
          </div>
          <div className="form-buttons">
            <button onClick={handleCreatePersonCancel} className="cancel-btn">Cancelar</button>
            <button onClick={handleCreatePersonSubmit} className="submit-btn" disabled={creating}>
              {creating ? 'Creando...' : 'Crear y seleccionar'}
            </button>
          </div>
        </div>
      )}

      <div className="step-buttons">
        <button onClick={handleCancel} className="cancel-btn">Cancelar</button>
        <button onClick={handleContinue} className="continue-btn" disabled={!selectedPerson}>
          Continuar →
        </button>
      </div>
    </div>
  );
};

export default PersonSelector;