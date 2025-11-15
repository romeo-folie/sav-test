import { useNavigate } from 'react-router-dom';
import type { User } from '../types/user';
import { Loader } from './loader';

interface UsersTableProps {
  users: User[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

const formatAddress = (address: User['address']): string => {
  if (!address) return '';
  return `${address.street}, ${address.state}, ${address.city}, ${address.zipcode}`;
};

const headerCellClasses = "text-left py-2 px-3 md:py-4 md:px-6 font-medium leading-5 text-header max-w-[250px] min-w-0 text-sm md:text-base";

export const UsersTable = ({ users, isLoading, isError }: UsersTableProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="border border-table rounded-md flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-primary">Error loading users. Please try again.</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-primary">No users found.</p>
      </div>
    );
  }

  return (
    <div className="border border-table rounded-md overflow-hidden">
      <div className="overflow-x-auto pb-2">
        <table className="w-full border-collapse min-w-[600px]">
          <thead className="text-lg">
            <tr className="border-b border-table">
              <th className={headerCellClasses}>Full name</th>
              <th className={headerCellClasses}>Email address</th>
              <th className={headerCellClasses}>Address</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const address = formatAddress(user.address);
              return (
                <tr
                  key={user.id}
                  className="border-b border-table last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigate(`/users/${user.id}/posts`, { state: { user } })}
                >
                  <td className="py-2 px-3 md:py-4 md:px-6 leading-5 text-primary text-sm md:text-base">
                    {user.name}
                  </td>
                  <td className="py-2 px-3 md:py-4 md:px-6 leading-5 text-primary max-w-[150px] min-w-0 text-sm md:text-base">
                    <div className="truncate" title={user.email}>
                      {user.email}
                    </div>
                  </td>
                  <td className="py-2 px-3 md:py-4 md:px-6 leading-5 text-primary max-w-[150px] min-w-0 text-sm md:text-base">
                    <div className="truncate" title={address}>
                      {address || '-'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};