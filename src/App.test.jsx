import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
describe("App test", () => {
  it('renders the application', () => {
    render(<App />);
    const textElement = screen.getByText(/Sandex/i);
    expect(textElement).toBeInTheDocument();
  })
});
