import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { UsersTable } from '../users-table';
import type { User } from '../../types/user';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('UsersTable', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const mockUsersWithAddress: User[] = [
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phone: '123-456-7890',
      address: {
        id: 'addr1',
        user_id: '1',
        street: '123 Main St',
        state: 'CA',
        city: 'San Francisco',
        zipcode: '94102',
      },
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      phone: '098-765-4321',
      address: {
        id: 'addr2',
        user_id: '2',
        street: '456 Oak Ave',
        state: 'NY',
        city: 'New York',
        zipcode: '10001',
      },
    },
  ];

  const mockUsersWithoutAddress: User[] = [
    {
      id: 3,
      name: 'Bob Johnson',
      username: 'bobjohnson',
      email: 'bob@example.com',
      phone: '555-123-4567',
    },
  ];

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe('Component Rendering', () => {
    it('renders table with correct headers', () => {
      renderWithRouter(<UsersTable users={mockUsersWithAddress} isLoading={false} isError={false} />);

      expect(screen.getByText('Full name')).toBeInTheDocument();
      expect(screen.getByText('Email address')).toBeInTheDocument();
      expect(screen.getByText('Address')).toBeInTheDocument();
    });

    it('renders user data correctly in table rows', () => {
      renderWithRouter(<UsersTable users={mockUsersWithAddress} isLoading={false} isError={false} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('123 Main St, CA, San Francisco, 94102')).toBeInTheDocument();

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('456 Oak Ave, NY, New York, 10001')).toBeInTheDocument();
    });

    it('formats address correctly using formatAddress helper', () => {
      renderWithRouter(<UsersTable users={mockUsersWithAddress} isLoading={false} isError={false} />);

      const addressCell = screen.getByText('123 Main St, CA, San Francisco, 94102');
      expect(addressCell).toBeInTheDocument();
    });

    it('handles users without addresses (shows "-")', () => {
      renderWithRouter(<UsersTable users={mockUsersWithoutAddress} isLoading={false} isError={false} />);

      const addressCell = screen.getByText('-');
      expect(addressCell).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });

    it('truncates long addresses with ellipsis and shows full address in title', () => {
      const longAddressUser: User[] = [
        {
          id: 4,
          name: 'Long Address User',
          username: 'longuser',
          email: 'long@example.com',
          phone: '555-0000',
          address: {
            id: 'addr3',
            user_id: '4',
            street: 'This is a very long street name that should be truncated',
            state: 'CA',
            city: 'A very long city name',
            zipcode: '12345',
          },
        },
      ];

      renderWithRouter(<UsersTable users={longAddressUser} isLoading={false} isError={false} />);

      const addressDiv = screen.getByTitle(
        'This is a very long street name that should be truncated, CA, A very long city name, 12345'
      );
      expect(addressDiv).toBeInTheDocument();
      expect(addressDiv).toHaveClass('truncate');
    });
  });

  describe('Loading State', () => {
    it('displays Loader component when isLoading is true', () => {
      const { container } = renderWithRouter(
        <UsersTable users={undefined} isLoading={true} isError={false} />
      );

      const loaderContainer = container.querySelector('.lds-ellipsis');
      expect(loaderContainer).toBeInTheDocument();
    });

    it('shows appropriate container styling for loading state', () => {
      const { container } = renderWithRouter(
        <UsersTable users={undefined} isLoading={true} isError={false} />
      );

      const loadingDiv = container.querySelector('.border.border-table.rounded-md');
      expect(loadingDiv).toBeInTheDocument();
      expect(loadingDiv).toHaveClass('flex', 'justify-center', 'items-center', 'h-64');
    });
  });

  describe('Error State', () => {
    it('displays error message when isError is true', () => {
      renderWithRouter(<UsersTable users={undefined} isLoading={false} isError={true} />);

      expect(screen.getByText('Error loading users. Please try again.')).toBeInTheDocument();
    });

    it('shows error message with correct styling', () => {
      const { container } = renderWithRouter(
        <UsersTable users={undefined} isLoading={false} isError={true} />
      );

      const errorMessage = screen.getByText('Error loading users. Please try again.');
      expect(errorMessage).toHaveClass('text-primary');
    });
  });

  describe('Empty State', () => {
    it('displays "No users found." when users array is empty', () => {
      renderWithRouter(<UsersTable users={[]} isLoading={false} isError={false} />);

      expect(screen.getByText('No users found.')).toBeInTheDocument();
    });

    it('displays "No users found." when users is undefined', () => {
      renderWithRouter(<UsersTable users={undefined} isLoading={false} isError={false} />);

      expect(screen.getByText('No users found.')).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('navigates to user posts page when row is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<UsersTable users={mockUsersWithAddress} isLoading={false} isError={false} />);

      const firstRow = screen.getByText('John Doe').closest('tr');
      expect(firstRow).toBeInTheDocument();

      await user.click(firstRow!);

      expect(mockNavigate).toHaveBeenCalledWith('/users/1/posts', { state: { user: mockUsersWithAddress[0] } });
    });

    it('passes user data in navigation state', async () => {
      const user = userEvent.setup();
      renderWithRouter(<UsersTable users={mockUsersWithAddress} isLoading={false} isError={false} />);

      const secondRow = screen.getByText('Jane Smith').closest('tr');
      await user.click(secondRow!);

      expect(mockNavigate).toHaveBeenCalledWith('/users/2/posts', { state: { user: mockUsersWithAddress[1] } });
    });
  });
});

