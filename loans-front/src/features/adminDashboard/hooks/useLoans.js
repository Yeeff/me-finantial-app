import { useState, useEffect } from 'react';
import api from '../../../services/api';

const useLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/loans?status=ACTIVE');
      setLoans(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const refetch = () => {
    fetchLoans();
  };

  return { loans, loading, error, refetch };
};

export default useLoans;