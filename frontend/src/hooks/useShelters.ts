import { useState, useEffect } from 'react';
import { getAllShelters, getShelterById, searchShelters, searchShelterByName, searchShelterByAddress, searchShelterByRepresentative, searchShelterByEvacueeCount, searchShelterByInjuredCount } from '@/lib/api';
import type { Shelter } from '@/types/api';

export function useShelters() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShelters = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllShelters();
      setShelters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  return { shelters, loading, error, refetch: fetchShelters };
}

export function useShelter(id: number) {
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShelter = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getShelterById(id);
      setShelter(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchShelter();
  }, [id]);

  return { shelter, loading, error, refetch: fetchShelter };
}

export function useSearchShelters(params: { shelterName?: string; address?: string; isActive?: boolean }) {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchShelters(params);
      setShelters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasParams = Object.values(params).some(v => v !== undefined);
    if (hasParams) search();
  }, [params.shelterName, params.address, params.isActive]);

  return { shelters, loading, error, refetch: search };
}

export function useSearchShelterByName(shelterName: string) {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchShelterByName(shelterName);
      setShelters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shelterName.trim()) search();
  }, [shelterName]);

  return { shelters, loading, error, refetch: search };
}

export function useSearchShelterByAddress(address: string) {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchShelterByAddress(address);
      setShelters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address.trim()) search();
  }, [address]);

  return { shelters, loading, error, refetch: search };
}

export function useSearchShelterByRepresentative(lastName: string, firstName: string) {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchShelterByRepresentative(lastName, firstName);
      setShelters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lastName.trim() || firstName.trim()) search();
  }, [lastName, firstName]);

  return { shelters, loading, error, refetch: search };
}

export function useSearchShelterByEvacueeCount(count: number) {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchShelterByEvacueeCount(count);
      setShelters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (count > 0) search();
  }, [count]);

  return { shelters, loading, error, refetch: search };
}

export function useSearchShelterByInjuredCount(count: number) {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchShelterByInjuredCount(count);
      setShelters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (count > 0) search();
  }, [count]);

  return { shelters, loading, error, refetch: search };
}
