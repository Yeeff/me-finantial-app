import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';

const usePeople = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const response = await api.get('/people');
      setPeople(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error fetching people');
      setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  const createPerson = async (personData) => {
    try {
      const response = await api.post('/people', personData);
      await fetchPeople(); // Refresh list
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error creating person');
    }
  };

  const getPerson = useCallback(async (id) => {
    try {
      const response = await api.get(`/people/${id}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error fetching person');
    }
  }, []);

  const getPersonLoans = useCallback(async (id) => {
    try {
      const response = await api.get(`/people/${id}/loans`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error fetching person loans');
    }
  }, []);

  useEffect(() => {
    fetchPeople();
  }, []);

  return {
    people,
    loading,
    error,
    refetch: fetchPeople,
    createPerson,
    getPerson,
    getPersonLoans
  };
};

export default usePeople;