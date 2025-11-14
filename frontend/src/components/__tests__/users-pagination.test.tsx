import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsersPagination } from '../users-pagination';

describe('UsersPagination', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  describe('Pagination Logic - Small Page Count (<=10)', () => {
    it('renders all page numbers when totalPages <= 10', () => {
      render(
        <UsersPagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    it('renders all 10 pages when totalPages is 10', () => {
      render(
        <UsersPagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />
      );

      for (let i = 1; i <= 10; i++) {
        expect(screen.getByText(String(i))).toBeInTheDocument();
      }
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });
  });

  describe('Pagination Logic - Current Page Near Start (<=3)', () => {
    it('renders ellipsis correctly when currentPage <= 3', () => {
      render(
        <UsersPagination currentPage={2} totalPages={15} onPageChange={mockOnPageChange} />
      );

      // Should show: 1, 2, 3, ..., 13, 14, 15
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('13')).toBeInTheDocument();
      expect(screen.getByText('14')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('renders correct pages when currentPage is 1', () => {
      render(
        <UsersPagination currentPage={1} totalPages={20} onPageChange={mockOnPageChange} />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('19')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('renders correct pages when currentPage is 3', () => {
      render(
        <UsersPagination currentPage={3} totalPages={25} onPageChange={mockOnPageChange} />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('23')).toBeInTheDocument();
      expect(screen.getByText('24')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });
  });

  describe('Pagination Logic - Current Page Near End (>= totalPages - 2)', () => {
    it('renders ellipsis correctly when currentPage >= totalPages - 2', () => {
      render(
        <UsersPagination currentPage={18} totalPages={20} onPageChange={mockOnPageChange} />
      );

      // Should show: 1, 2, 3, ..., 18, 19, 20
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('19')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('renders correct pages when currentPage is totalPages', () => {
      render(
        <UsersPagination currentPage={20} totalPages={20} onPageChange={mockOnPageChange} />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('19')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('renders correct pages when currentPage is totalPages - 1', () => {
      render(
        <UsersPagination currentPage={19} totalPages={20} onPageChange={mockOnPageChange} />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('19')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });
  });

  describe('Pagination Logic - Current Page in Middle', () => {
    it('renders ellipsis on both sides when currentPage is in middle', () => {
      render(
        <UsersPagination currentPage={10} totalPages={20} onPageChange={mockOnPageChange} />
      );

      // Should show: 1, ..., 9, 10, 11, ..., 20
      expect(screen.getByText('1')).toBeInTheDocument();
      const ellipsis = screen.getAllByText('...');
      expect(ellipsis).toHaveLength(2);
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('11')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('renders correct pages when currentPage is 5 of 15', () => {
      render(
        <UsersPagination currentPage={5} totalPages={15} onPageChange={mockOnPageChange} />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      const ellipsis = screen.getAllByText('...');
      expect(ellipsis).toHaveLength(2);
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });
  });

  describe('Button States', () => {
    it('disables Previous button when currentPage === 1', () => {
      render(
        <UsersPagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />
      );

      const previousButton = screen.getByText('Previous').closest('button');
      expect(previousButton).toBeDisabled();
    });

    it('disables Next button when currentPage === totalPages', () => {
      render(
        <UsersPagination currentPage={10} totalPages={10} onPageChange={mockOnPageChange} />
      );

      const nextButton = screen.getByText('Next').closest('button');
      expect(nextButton).toBeDisabled();
    });

    it('enables Previous button when currentPage > 1', () => {
      render(
        <UsersPagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
      );

      const previousButton = screen.getByText('Previous').closest('button');
      expect(previousButton).not.toBeDisabled();
    });

    it('enables Next button when currentPage < totalPages', () => {
      render(
        <UsersPagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
      );

      const nextButton = screen.getByText('Next').closest('button');
      expect(nextButton).not.toBeDisabled();
    });

    it('disables all buttons when isLoading is true', () => {
      render(
        <UsersPagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
          isLoading={true}
        />
      );

      const previousButton = screen.getByText('Previous').closest('button');
      const nextButton = screen.getByText('Next').closest('button');
      const pageButton = screen.getByText('5');

      expect(previousButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
      expect(pageButton.closest('button')).toBeDisabled();
    });

    it('highlights active page with correct styling', () => {
      render(
        <UsersPagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
      );

      const activePageButton = screen.getByText('5').closest('button');
      expect(activePageButton).toHaveClass('border-2', 'border-table');
    });

    it('does not highlight inactive pages', () => {
      render(
        <UsersPagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
      );

      const inactivePageButton = screen.getByText('3').closest('button');
      expect(inactivePageButton).not.toHaveClass('border-2', 'border-table');
    });
  });

  describe('User Interactions', () => {
    it('calls onPageChange with correct page number when page button clicked', async () => {
      const user = userEvent.setup();
      render(
        <UsersPagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />
      );

      const page3Button = screen.getByText('3');
      await user.click(page3Button);

      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    it('calls onPageChange with previous page when Previous button clicked', async () => {
      const user = userEvent.setup();
      render(
        <UsersPagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
      );

      const previousButton = screen.getByText('Previous').closest('button');
      await user.click(previousButton!);

      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it('calls onPageChange with next page when Next button clicked', async () => {
      const user = userEvent.setup();
      render(
        <UsersPagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
      );

      const nextButton = screen.getByText('Next').closest('button');
      await user.click(nextButton!);

      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
      expect(mockOnPageChange).toHaveBeenCalledWith(6);
    });

    it('does not call onPageChange when disabled Previous button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <UsersPagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />
      );

      const previousButton = screen.getByText('Previous').closest('button');
      await user.click(previousButton!);

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });

    it('does not call onPageChange when disabled Next button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <UsersPagination currentPage={10} totalPages={10} onPageChange={mockOnPageChange} />
      );

      const nextButton = screen.getByText('Next').closest('button');
      await user.click(nextButton!);

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles single page (totalPages === 1)', () => {
      render(
        <UsersPagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
      expect(screen.getByText('Previous').closest('button')).toBeDisabled();
      expect(screen.getByText('Next').closest('button')).toBeDisabled();
    });

    it('handles very large page numbers', () => {
      render(
        <UsersPagination currentPage={100} totalPages={200} onPageChange={mockOnPageChange} />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      const ellipsis = screen.getAllByText('...');
      expect(ellipsis).toHaveLength(2);
      expect(screen.getByText('99')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('101')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });
  });
});

