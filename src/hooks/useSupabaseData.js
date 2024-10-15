import { useState, useEffect } from 'react';
import { supabase } from '../components/auth/supabaseClient';

const useSupabaseData = (table) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table: table }, fetchData)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table]);

  return { data, loading, error, refreshData: fetchData };
};

export default useSupabaseData;
