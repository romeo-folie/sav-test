import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserPosts, deletePost, createPost } from '../lib/api';

export const useUserPosts = (userId: string | number) => {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!userId,
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string | number) => deletePost(postId),
    onSuccess: () => {
      // Invalidate all post queries to refetch after deletion
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: Error) => {
      // Error handling will be done in the component
      console.error('Failed to delete post:', error);
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      body,
      userId,
    }: {
      title: string;
      body: string;
      userId: string | number;
    }) => createPost(title, body, userId),
    onSuccess: (_, variables) => {
      // Invalidate the specific user's posts to refetch after creation
      queryClient.invalidateQueries({ queryKey: ['posts', variables.userId] });
    },
  });
};

