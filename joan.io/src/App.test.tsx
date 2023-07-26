import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders moving glyphs', () => {
  render(<App />);
  
  // Wait for the glyphs to be generated and rendered
  setTimeout(() => {
    const glyphs = screen.getAllByRole('glyph');
    expect(glyphs).toHaveLength(10);
  }, 1000);
});
