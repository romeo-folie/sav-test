import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUserPosts, useDeletePost, useCreatePost } from '../hooks/usePosts';
import { useUser } from '../hooks/useUsers';
import { Breadcrumb } from '../components/breadcrumb';
import { PostCard } from '../components/post-card';
import { NewPostCard } from '../components/new-post-card';
import { PostForm } from '../components/post-form';
import { Loader } from '../components/loader';
import { Toast } from '../components/toast';
import { ConfirmationModal } from '../components/confirmation-modal';

export const UserPostsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading: isUserLoading, isError: isUserError } = useUser(userId || '');
  const { data: posts, isLoading: isPostsLoading, isError: isPostsError } = useUserPosts(userId || '');
  const deletePostMutation = useDeletePost(userId || '');
  const createPostMutation = useCreatePost();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

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

  if (isUserError) {
    navigate('/users');
    return null;
  }

  const isLoading = isUserLoading || isPostsLoading;
  const isError = isPostsError;

  const handleDelete = (postId: string) => {
    setPostToDelete(postId);
  };

  const confirmDelete = () => {
    if (postToDelete !== null) {
      deletePostMutation.mutate(postToDelete, {
        onError: () => {
          setShowErrorToast(true);
        },
      });
      setPostToDelete(null);
    }
  };

  const cancelDelete = () => {
    setPostToDelete(null);
  };

  const handleCreatePost = async (title: string, body: string) => {
    return createPostMutation.mutateAsync({
      title,
      body,
      userId,
    });
  };

  const postCount = posts?.length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <Toast
        message="Error: There was an error during deletion"
        isVisible={showErrorToast}
        onClose={() => setShowErrorToast(false)}
      />

      {deletePostMutation.isPending && (
        <div className="fixed inset-0 flex justify-center items-center">
          <Loader />
        </div>
      )}

      <div className="w-full max-w-[70%] lg:max-w-4xl mx-auto">
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

        {!isError && (
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

      <ConfirmationModal
        isOpen={postToDelete !== null}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

