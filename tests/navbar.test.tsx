import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithProviders } from './test-utils';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';

const mockedUseSession = useSession as unknown as ReturnType<typeof vi.fn>;

describe('Navbar', () => {
  beforeEach(() => {
    mockedUseSession.mockReset();
  });

  it('renders primary navigation links and language switcher for guests', () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    });

    const { getByText, getAllByLabelText } = renderWithProviders(<Navbar />);
    expect(getByText('Listings')).toBeInTheDocument();
    expect(getByText('Dashboard')).toBeInTheDocument();
    expect(getByText('Sign in')).toBeInTheDocument();
    expect(getAllByLabelText('Language').length).toBeGreaterThan(0);
  });

  it('shows user info when authenticated', () => {
    mockedUseSession.mockReturnValue({
      data: {
        user: { name: 'Admin', email: 'admin@example.com' }
      },
      status: 'authenticated'
    });

    const { getByText } = renderWithProviders(<Navbar />);
    expect(getByText('Admin')).toBeInTheDocument();
    expect(getByText('Sign out')).toBeInTheDocument();
  });
});

