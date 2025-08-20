import { useState, useEffect } from 'react';
import { getAllUsers, getUserById, getUserByUsername, getUserByEmail, getUsersByRole, searchUsers, searchUsersAdvanced } from '@/lib/api';
import type { UserDto, UserRole } from '@/types/api';

export function useUsers() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
}

export function useUser(id: number) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserById(id);
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  return { user, loading, error, refetch: fetchUser };
}

export function useUserByUsername(username: string) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserByUsername(username);
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchUser();
  }, [username]);

  return { user, loading, error, refetch: fetchUser };
}

export function useUserByEmail(email: string) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserByEmail(email);
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) fetchUser();
  }, [email]);

  return { user, loading, error, refetch: fetchUser };
}

export function useUsersByRole(role: UserRole) {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsersByRole(role);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role) fetchUsers();
  }, [role]);

  return { users, loading, error, refetch: fetchUsers };
}

export function useSearchUsers(keyword: string) {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchUsers(keyword);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keyword.trim()) search();
  }, [keyword]);

  return { users, loading, error, refetch: search };
}

export function useSearchUsersAdvanced(params: { username?: string; email?: string; role?: UserRole; isActive?: boolean }) {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchUsersAdvanced(params);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasParams = Object.values(params).some(v => v !== undefined);
    if (hasParams) search();
  }, [params.username, params.email, params.role, params.isActive]);

  return { users, loading, error, refetch: search };
}
