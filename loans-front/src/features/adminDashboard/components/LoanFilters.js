import React, { useState, useEffect } from 'react';
import './LoanFilters.css';

const LoanFilters = ({ onSearch, onFilter, onSort, onRefresh, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  return (
    <div className="loan-filters">
      {/* Búsqueda */}
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Buscar préstamo o persona..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="clear-search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtros y ordenamiento */}
      <div className="filters-row">
        <select
          onChange={(e) => onFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Todos</option>
          <option value="recent">Recientes (menos de 30 días)</option>
          <option value="medium">Medianos (30-90 días)</option>
          <option value="old">Antiguos (más de 90 días)</option>
        </select>

        <select
          onChange={(e) => onSort(e.target.value)}
          className="filter-select"
        >
          <option value="debt-desc">Mayor deuda</option>
          <option value="debt-asc">Menor deuda</option>
          <option value="date-desc">Más reciente</option>
          <option value="date-asc">Más antiguo</option>
          <option value="name-asc">Por nombre (A-Z)</option>
        </select>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="refresh-btn"
        >
          {isLoading ? '⏳' : '🔄'} Actualizar
        </button>
      </div>
    </div>
  );
};

export default LoanFilters;