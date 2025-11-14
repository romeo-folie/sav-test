import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUserPosts, useDeletePost, useCreatePost } from '../hooks/usePosts';
import { Breadcrumb } from '../components/breadcrumb';
import { PostCard } from '../components/post-card';
import { NewPostCard } from '../components/new-post-card';
import { PostForm } from '../components/post-form';
import { Loader } from '../components/loader';
import { Toast } from '../components/toast';
import type { User } from '../types/user';

export const UserPostsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const user = (location.state as { user?: User })?.user;

  const { data: posts, isLoading, isError } = useUserPosts(userId || '');
  const deletePostMutation = useDeletePost();
  const createPostMutation = useCreatePost();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => {
        setShowErrorToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorToast]);

  if (!userId) {
    navigate('/users');
    return null;
  }

  if (!user) {
    navigate('/users');
    return null;
  }

  const handleDelete = (postId: number) => {
    deletePostMutation.mutate(postId, {
      onError: () => {
        setShowErrorToast(true);
      },
    });
  };

  const handleCreatePost = async (title: string, body: string) => {
    return createPostMutation.mutateAsync({
      title,
      body,
      userId,
    });
  };

  const postCount = posts?.length || 0;

  return (
    <div className="min-h-screen p-8">
      <Toast
        message="Error: There was an error during deletion"
        isVisible={showErrorToast}
        onClose={() => setShowErrorToast(false)}
      />

      {(isLoading || deletePostMutation.isPending) && (
        <div className="fixed inset-0 flex justify-center items-center">
          <Loader />
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <Breadcrumb userName={user.name} />
        
        <h1 className="text-2xl font-semibold mb-2 text-primary">{user.name}</h1>
        <p className="text-header mb-8">
          {user.email} <span className="text-primary">• {postCount} {postCount === 1 ? 'Post' : 'Posts'}</span>
        </p>

        {isError && (
          <div className="border border-table rounded-md flex justify-center items-center h-64">
            <p className="text-primary">Error loading posts. Please try again.</p>
          </div>
        )}

      {!isLoading && !deletePostMutation.isPending && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NewPostCard onClick={() => setIsFormOpen(true)} />
            {posts?.map((post) => (
              <PostCard key={post.id} post={post} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <PostForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreatePost}
        userId={userId}
      />
    </div>
  );
};

