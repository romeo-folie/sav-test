import { useQuery } from '@tanstack/react-query';
import { fetchUsers, fetchUsersCount } from '../lib/api';

export const useUsers = (pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ['users', pageNumber, pageSize],
    queryFn: () => fetchUsers(pageNumber, pageSize),
  });
};

export const useUsersCount = () => {
  return useQuery({
    queryKey: ['users', 'count'],
    queryFn: fetchUsersCount,
  });
};

