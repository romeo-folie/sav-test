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
      <table className="w-full border-collapse">
        <thead className="text-lg">
          <tr className="border-b border-table">
            <th className="text-left py-4 px-6 font-medium leading-5 text-header max-w-[250px] min-w-0">Full name</th>
            <th className="text-left py-4 px-6 font-medium leading-5 text-header max-w-[250px] min-w-0">Email address</th>
            <th className="text-left py-4 px-6 font-medium leading-5 text-header max-w-[250px] min-w-0">Address</th>
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
                <td className="py-4 px-6 leading-5 text-primary">
                  {/* <div className="truncate" title={user.name}> */}
                    {user.name}
                  {/* </div> */}
                </td>
                <td className="py-4 px-6 leading-5 text-primary max-w-[150px] min-w-0">
                  <div className="truncate" title={user.email}>
                    {user.email}
                  </div>
                </td>
                <td className="py-4 px-6 leading-5 text-primary max-w-[150px] min-w-0">
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
  );
};