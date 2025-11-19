import { Trash2 } from 'lucide-react';
import type { Post } from '../types/post';

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
}

export const PostCard = ({ post, onDelete }: PostCardProps) => {
  return (
    <div className="bg-white rounded-md shadow-sm border border-table p-6 relative flex flex-col">
      <button
        onClick={() => onDelete(post.id)}
        className="absolute top-4 right-4 text-red-light hover:opacity-80 transition-colors cursor-pointer"
        aria-label="Delete post"
      >
        <Trash2 size={18} />
      </button>
      <h3 className="font-semibold text-primary text-lg mb-2 pr-8 mb-4 line-clamp-3 overflow-hidden">
        {post.title}
      </h3>
      <p className="text-base leading-relaxed line-clamp-10 overflow-hidden">
        {post.body}
      </p>
    </div>
  );
};

