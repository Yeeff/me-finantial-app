import React, { useState, useEffect, useMemo } from 'react';
import usePeople from '../hooks/usePeople';
import PersonCard from '../components/PersonCard';
import CreatePersonModal from '../components/CreatePersonModal';
import './People.css';

const People = () => {
  const { people, loading, error, refetch, createPerson } = usePeople();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter people based on search term
  const filteredPeople = useMemo(() => {
    if (!searchTerm.trim()) return people;

    return people.filter(person =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.identification.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [people, searchTerm]);

  const handleCreatePerson = async (personData) => {
    try {
      await createPerson(personData);
      setIsModalOpen(false);
      // The hook already refreshes the list
    } catch (error) {
      // Error is handled in the modal
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="people-page">
        <div className="loading">Cargando personas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="people-page">
        <div className="error">
          Error al cargar personas: {error}
          <button onClick={refetch} className="retry-btn">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="people-page">
      <div className="people-header">
        <h1 className="page-title">👥 Personas</h1>
        <button
          className="create-person-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Nueva Persona
        </button>
      </div>

      <div className="search-section">
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre o identificación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="people-list-header">
        <h2 className="list-title">📋 LISTA DE PERSONAS ({filteredPeople.length})</h2>
      </div>

      <div className="people-grid">
        {filteredPeople.length > 0 ? (
          filteredPeople.map(person => (
            <PersonCard key={person.id} person={person} />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <h3>No hay personas registradas</h3>
              <p>Haz clic en "+ Nueva Persona" para comenzar</p>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreatePersonModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreatePerson}
        />
      )}
    </div>
  );
};

export default People;