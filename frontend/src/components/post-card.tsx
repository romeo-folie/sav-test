import { Trash2 } from 'lucide-react';
import type { Post } from '../types/post';

interface PostCardProps {
  post: Post;
  onDelete: (postId: number) => void;
}

export const PostCard = ({ post, onDelete }: PostCardProps) => {
  return (
    <div className="bg-white rounded-md shadow-sm border border-table p-6 relative">
      <button
        onClick={() => onDelete(post.id)}
        className="absolute top-4 right-4 text-red-light hover:opacity-80 transition-colors"
        aria-label="Delete post"
      >
        <Trash2 size={18} />
      </button>
      <h3 className="font-semibold text-primary text-lg mb-3 pr-8">{post.title}</h3>
      <p className="text-primary text-base overflow-hidden text-ellipsis line-clamp-9">{post.body}</p>
    </div>
  );
};

