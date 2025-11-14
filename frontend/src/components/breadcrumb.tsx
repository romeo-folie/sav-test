import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  userName: string;
}

export const Breadcrumb = ({ userName }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center gap-2 mb-6">
      <Link to="/users" className="text-primary hover:underline">
        Users
      </Link>
      <ChevronRight size={16} className="text-header" />
      <span className="text-header">{userName}</span>
    </nav>
  );
};

