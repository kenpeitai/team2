import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Shelter } from '@/types/api';
import { getShelterById } from '@/lib/api';

interface UseShelterReturn {
  shelter: Shelter | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useShelter(): UseShelterReturn {
  const params = useParams();
  const shelterId = params.id as string;
  
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShelter = async () => {
    if (!shelterId) {
      setError('避難所IDが指定されていません');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const shelterData = await getShelterById(parseInt(shelterId));
      setShelter(shelterData);
    } catch (err) {
      console.error('避難所情報の取得に失敗しました:', err);
      setError('避難所情報の取得に失敗しました');
      setShelter(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelter();
  }, [shelterId]);

  return {
    shelter,
    loading,
    error,
    refetch: fetchShelter,
  };
}
