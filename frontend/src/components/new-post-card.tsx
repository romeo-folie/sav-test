import { Plus } from 'lucide-react';

interface NewPostCardProps {
  onClick: () => void;
}

export const NewPostCard = ({ onClick }: NewPostCardProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-md border-dashed border-2 border-table p-6 flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:border-primary/50 transition-colors"
    >
      <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center mb-3">
        <Plus size={24} />
      </div>
      <span className="text-primary font-medium">New Post</span>
    </button>
  );
};

