import { useState, type FormEvent } from 'react';
import type { Post } from '../types/post';

interface PostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, body: string) => Promise<Post>;
  userId: string | number;
}

const MAX_TITLE_LENGTH = 100;
const MAX_BODY_LENGTH = 500;

export const PostForm = ({ isOpen, onClose, onSubmit }: PostFormProps) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !body.trim()) {
      setError('Both title and content are required');
      return;
    }

    if (title.length > MAX_TITLE_LENGTH) {
      setError(`Title must be ${MAX_TITLE_LENGTH} characters or less`);
      return;
    }

    if (body.length > MAX_BODY_LENGTH) {
      setError(`Content must be ${MAX_BODY_LENGTH} characters or less`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(title.trim(), body.trim());
      setTitle('');
      setBody('');
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setBody('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-md p-8 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-semibold text-primary mb-6">New post</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-primary font-medium mb-2">
              Post title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title"
              className="w-full px-4 py-2 border border-table rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-primary font-medium mb-2">
              Post content
            </label>
            <textarea
              id="content"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write something mind-blowing"
              rows={6}
              className="w-full px-4 py-2 border border-table rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
            />
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-table rounded-md text-primary bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue bg-blue-hover text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

