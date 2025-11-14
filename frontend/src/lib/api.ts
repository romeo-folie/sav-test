import type { User } from '../types/user';
import type { Post } from '../types/post';
import type { UsersCountResponse, DeletePostResponse } from '../types/api';

const API_BASE_URL = 'http://localhost:3001';

export const api = {
  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};

// API client functions
export const fetchUsers = async (pageNumber: number, pageSize: number): Promise<User[]> => {
  return api.get<User[]>('/users', { pageNumber, pageSize });
};

export const fetchUsersCount = async (): Promise<number> => {
  const response = await api.get<UsersCountResponse>('/users/count');
  return response.count;
};

export const fetchUserPosts = async (userId: string | number): Promise<Post[]> => {
  return api.get<Post[]>('/posts', { userId });
};

export const deletePost = async (postId: string | number): Promise<DeletePostResponse> => {
  return api.delete<DeletePostResponse>(`/posts/${postId}`);
};

export const createPost = async (
  title: string,
  body: string,
  userId: string | number
): Promise<Post> => {
  return api.post<Post>('/posts', { title, body, userId });
};

