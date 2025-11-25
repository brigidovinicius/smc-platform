/**
 * Component tests
 * Basic component rendering tests
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

describe('UI Components', () => {
  describe('Button', () => {
    it('should render button with text', () => {
      const { getByText } = render(<Button>Click me</Button>);
      expect(getByText('Click me')).toBeInTheDocument();
    });

    it('should apply default variant styles', () => {
      const { container } = render(<Button>Test</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-[#0044CC]');
    });
  });

  describe('Card', () => {
    it('should render card with content', () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>Card content</CardContent>
        </Card>
      );
      expect(getByText('Test Card')).toBeInTheDocument();
      expect(getByText('Card content')).toBeInTheDocument();
    });
  });
});

