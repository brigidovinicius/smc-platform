import React from 'react';
import { describe, it, expect } from 'vitest';
import AssetsPage from '@/app/admin/assets/page';
import BlogPage from '@/app/admin/blog/page';
import SettingsPage from '@/app/admin/settings/page';
import { renderWithProviders } from './test-utils';

describe('Admin pages', () => {
  it('renders assets page with search input and CTA', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<AssetsPage />);
    expect(getByText('Assets')).toBeInTheDocument();
    expect(getByPlaceholderText('Search assets...')).toBeInTheDocument();
    expect(getByText('Add Asset')).toBeInTheDocument();
  });

  it('renders blog page with search input', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<BlogPage />);
    expect(getByText('Blog Posts')).toBeInTheDocument();
    expect(getByPlaceholderText('Search posts...')).toBeInTheDocument();
    expect(getByText('New Post')).toBeInTheDocument();
  });

  it('renders settings page sections', () => {
    const { getByText } = renderWithProviders(<SettingsPage />);
    expect(getByText('Platform Settings')).toBeInTheDocument();
    expect(getByText('General Settings')).toBeInTheDocument();
    expect(getByText('SEO Defaults')).toBeInTheDocument();
  });
});


