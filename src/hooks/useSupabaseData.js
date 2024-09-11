import { useState, useEffect } from 'react';
import { supabase } from '../components/auth/supabaseClient';

const useSupabaseData = (table) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: fetchedData, error: fetchError } = await supabase
        .from(table)
        .select("*");
      if (fetchError) setError(fetchError);
      else setData(fetchedData);
    };

    fetchData();
  }, [table]);

  return { data, error };
};

export default useSupabaseData;
