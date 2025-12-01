import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from './test-utils';
import MarketGrid from '@/components/MarketGrid';
import OfferCard from '@/components/OfferCard';

describe('Marketplace components', () => {
  it('renders grid with responsive classes', () => {
    const items = [
      { id: '1', title: 'Offer 1', summary: 'Summary', price: 1000, classification: 'SaaS', status: 'ACTIVE' },
      { id: '2', title: 'Offer 2', summary: 'Summary', price: 2000, classification: 'Marketplace', status: 'PENDING' }
    ];

    const { container } = renderWithProviders(
      <MarketGrid
        items={items}
        renderItem={(item) => <OfferCard key={item.id} offer={item} />}
      />
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid.className).toContain('md:grid-cols-2');
  });

  it('renders offer card details', () => {
    const offer = {
      id: 'offer-1',
      title: 'Premium SaaS Tool',
      summary: 'Modern analytics platform',
      price: 50000,
      classification: 'SaaS',
      status: 'ACTIVE'
    };

    const { getByText } = renderWithProviders(<OfferCard offer={offer} />);
    expect(getByText('Premium SaaS Tool')).toBeInTheDocument();
    expect(getByText('Modern analytics platform')).toBeInTheDocument();
    expect(getByText('SaaS')).toBeInTheDocument();
  });
});




