import React, { useState, useEffect } from 'react';
import useLoans from '../hooks/useLoans';
import SummaryCards from '../components/SummaryCards';
import LoanFilters from '../components/LoanFilters';
import LoanCard from '../components/LoanCard';
import CreateLoanModal from '../components/CreateLoanModal';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { loans, loading, error, refetch } = useLoans();
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [updatedActiveLoans, setUpdatedActiveLoans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('debt-desc');
  const [showCreateLoanModal, setShowCreateLoanModal] = useState(false);

  // Filter active loans
  const activeLoans = loans.filter(loan => loan.status === 'ACTIVE');

  // Update active loans with calculations
  useEffect(() => {
    setUpdatedActiveLoans(activeLoans.map(updateLoanCalculations));
  }, [activeLoans]);

  // Real-time interest calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdatedActiveLoans(prevLoans =>
        prevLoans.map(loan => updateLoanCalculations(loan))
      );
    }, 60000); // cada 60 segundos
    return () => clearInterval(interval);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...updatedActiveLoans];

    // Búsqueda
    if (searchQuery) {
      result = result.filter(loan =>
        loan.person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.person.identification.includes(searchQuery)
      );
    }

    // Filtro por antigüedad
    if (filter !== 'all') {
      result = result.filter(loan => {
        const days = loan.daysAccrued || 0;
        if (filter === 'recent') return days <= 30;
        if (filter === 'medium') return days > 30 && days <= 90;
        if (filter === 'old') return days > 90;
        return true;
      });
    }

    // Ordenamiento
    result.sort((a, b) => {
      if (sort === 'debt-desc') return (b.totalOwed || b.totalDebt) - (a.totalOwed || a.totalDebt);
      if (sort === 'debt-asc') return (a.totalOwed || a.totalDebt) - (b.totalOwed || b.totalDebt);
      if (sort === 'date-desc') return new Date(b.startDate) - new Date(a.startDate);
      if (sort === 'date-asc') return new Date(a.startDate) - new Date(b.startDate);
      if (sort === 'name-asc') return a.person.name.localeCompare(b.person.name);
      return 0;
    });

    setFilteredLoans(result);
  }, [updatedActiveLoans, searchQuery, filter, sort]);

  // Helper functions
  const updateLoanCalculations = (loan) => {
    const days = calculateDaysSince(loan.lastConsolidationDate || loan.startDate);
    const interest = calculateAccruedInterest(
      parseFloat(loan.currentCapital),
      loan.interestRate,
      loan.interestType,
      days
    );
    return {
      ...loan,
      daysAccrued: days,
      accruedInterest: interest,
      totalOwed: parseFloat(loan.currentCapital) + interest
    };
  };

  const calculateDaysSince = (date) => {
    const today = new Date();
    const lastDate = new Date(date);
    return Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  };

  const calculateAccruedInterest = (capital, rate, type, days) => {
    const dailyRate = type === 'MONTHLY' ? (rate / 100) / 30 : (rate / 100) / 365;
    return capital * dailyRate * days;
  };

  const handleViewDetail = (id) => {
    // Navigate to /loans/:id
    alert(`Navigate to loan detail ${id}`);
  };

  const handleRegisterPayment = (id) => {
    // Open payment modal
    alert(`Open payment modal for loan ${id}`);
  };

  const handleSendLink = (link) => {
    // Copy or share link
    navigator.clipboard.writeText(link);
    alert(`Link copied: ${link}`);
  };

  const handleNuevoPrestamo = () => {
    setShowCreateLoanModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateLoanModal(false);
  };

  const handleFormSuccess = () => {
    refetch();
  };

  if (loading) return <div className="p-6">Cargando préstamos...</div>;

  return (
    <div className="admin-dashboard">
      <header>
        <h1>💰 Dashboard</h1>
        <button className="new-loan-btn" onClick={handleNuevoPrestamo}>+ Nuevo Préstamo</button>
      </header>

      <div className="summary">
        <h2>📊 RESUMEN GENERAL</h2>
        <SummaryCards loans={updatedActiveLoans} />
      </div>

      <LoanFilters
        onSearch={setSearchQuery}
        onFilter={setFilter}
        onSort={setSort}
        onRefresh={refetch}
        isLoading={loading}
      />

      <div className="loans-list">
        <h2>📋 PRÉSTAMOS ({filteredLoans.length})</h2>

        {filteredLoans.length === 0 ? (
          <div style={{textAlign: 'center', padding: '50px 0', color: '#666'}}>
            {searchQuery ? '🔍 No se encontraron préstamos' : '📭 No hay préstamos activos'}
          </div>
        ) : (
          filteredLoans.map(loan => (
            <LoanCard
              key={loan.id}
              loan={loan}
              onViewDetail={handleViewDetail}
              onRegisterPayment={handleRegisterPayment}
              onSendLink={handleSendLink}
            />
          ))
        )}
      </div>

      {showCreateLoanModal && (
        <CreateLoanModal onClose={handleCloseModal} onSuccess={handleFormSuccess} />
      )}
    </div>
  );
};

export default AdminDashboard;