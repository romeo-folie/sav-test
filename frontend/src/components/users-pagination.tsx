import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UsersPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const UsersPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: UsersPaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-end items-center gap-1 md:gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="px-2 py-2 md:px-4 md:py-3 disabled:opacity-40 disabled:cursor-not-allowed text-primary rounded transition-colors flex items-center gap-1 md:gap-2"
      >
        <ChevronLeft size={14} className="md:w-4 md:h-4" />
        <span className="hidden md:inline text-sm md:text-base">Previous</span>
      </button>

      <div className="flex items-center gap-1 md:gap-2 mx-2 md:mx-4">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-1 md:px-3 text-primary text-sm md:text-base">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              disabled={isLoading}
              className={`min-w-[32px] h-8 px-2 py-1 md:min-w-[40px] md:h-12 md:px-4 md:py-3 rounded text-sm md:text-base font-medium ${
                isActive
                  ? 'border-2 border-table text-primary'
                  : 'text-primary'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="px-2 py-2 md:px-4 md:py-3 disabled:opacity-40 disabled:cursor-not-allowed text-primary rounded transition-colors flex items-center gap-1 md:gap-2"
      >
        <span className="hidden md:inline text-sm md:text-base">Next</span>
        <ChevronRight size={14} className="md:w-4 md:h-4" />
      </button>
    </div>
  );
};