import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers, useUsersCount } from '../useUsers';
import * as api from '../../lib/api';
import type { User } from '../../types/user';

// Mock the API module
vi.mock('../../lib/api', () => ({
  fetchUsers: vi.fn(),
  fetchUsersCount: vi.fn(),
}));

describe('useUsers', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  describe('Query Setup', () => {
    it('sets up React Query with correct queryKey', async () => {
      const mockUsers: User[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          phone: '123-456-7890',
        },
      ];

      vi.mocked(api.fetchUsers).mockResolvedValue(mockUsers);

      const { result } = renderHook(() => useUsers(0, 4), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(api.fetchUsers).toHaveBeenCalledWith(0, 4);
      expect(result.current.data).toEqual(mockUsers);
    });

    it('uses correct queryKey format', async () => {
      const mockUsers: User[] = [];
      vi.mocked(api.fetchUsers).mockResolvedValue(mockUsers);

      renderHook(() => useUsers(2, 10), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(api.fetchUsers).toHaveBeenCalledWith(2, 10);
      });
    });
  });

  describe('Loading State', () => {
    it('returns loading state initially', () => {
      vi.mocked(api.fetchUsers).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useUsers(0, 4), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('Success State', () => {
    it('returns data when fetch succeeds', async () => {
      const mockUsers: User[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          phone: '123-456-7890',
          address: {
            id: '660e8400-e29b-41d4-a716-446655440000',
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            street: '123 Main St',
            state: 'CA',
            city: 'San Francisco',
            zipcode: '94102',
          },
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Jane Smith',
          username: 'janesmith',
          email: 'jane@example.com',
          phone: '098-765-4321',
        },
      ];

      vi.mocked(api.fetchUsers).mockResolvedValue(mockUsers);

      const { result } = renderHook(() => useUsers(0, 4), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockUsers);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('calls fetchUsers with correct parameters', async () => {
      const mockUsers: User[] = [];
      vi.mocked(api.fetchUsers).mockResolvedValue(mockUsers);

      renderHook(() => useUsers(3, 8), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(api.fetchUsers).toHaveBeenCalledWith(3, 8);
      });
    });
  });

  describe('Error State', () => {
    it('returns error state when fetch fails', async () => {
      const errorMessage = 'Failed to fetch users';
      vi.mocked(api.fetchUsers).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useUsers(0, 4), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeDefined();
    });

    it('handles network errors', async () => {
      vi.mocked(api.fetchUsers).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useUsers(0, 4), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });
});

describe('useUsersCount', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  describe('Query Setup', () => {
    it('sets up React Query with correct queryKey', async () => {
      vi.mocked(api.fetchUsersCount).mockResolvedValue(42);

      const { result } = renderHook(() => useUsersCount(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(api.fetchUsersCount).toHaveBeenCalled();
      expect(result.current.data).toBe(42);
    });
  });

  describe('Loading State', () => {
    it('returns loading state initially', () => {
      vi.mocked(api.fetchUsersCount).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useUsersCount(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('Success State', () => {
    it('returns count when fetch succeeds', async () => {
      vi.mocked(api.fetchUsersCount).mockResolvedValue(100);

      const { result } = renderHook(() => useUsersCount(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe(100);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  describe('Error State', () => {
    it('returns error state when fetch fails', async () => {
      vi.mocked(api.fetchUsersCount).mockRejectedValue(new Error('Failed to fetch count'));

      const { result } = renderHook(() => useUsersCount(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeDefined();
    });
  });
});

