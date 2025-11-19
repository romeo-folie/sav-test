import { useState } from 'react';
import { useUsers, useUsersCount } from '../hooks/useUsers';
import { UsersTable } from '../components/users-table';
import { UsersPagination } from '../components/users-pagination';

const PAGE_SIZE = 4;

export const UsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageNumber = currentPage - 1; // Backend uses 0-based indexing

  const { data: users, isLoading: isLoadingUsers, isError: isUsersError } = useUsers(
    pageNumber,
    PAGE_SIZE
  );
  const { data: totalCount, isLoading: isLoadingCount } = useUsersCount();

  const totalPages = totalCount ? Math.ceil(totalCount / PAGE_SIZE) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium font-sans leading-tight sm:leading-normal md:leading-6xl tracking-normal mb-6 text-primary">Users</h1>
        
        <div className="bg-white rounded-lg mb-8">
          <UsersTable
            users={users}
            isLoading={isLoadingUsers || isLoadingCount}
            isError={isUsersError}
          />
        </div>

        <UsersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoadingUsers || isLoadingCount}
        />
      </div>
    </div>
  );
};

