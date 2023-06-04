import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the application', () => {
  render(<App />);
  const textElement = screen.getByText(/Sandex/i);
  expect(textElement).toBeInTheDocument();
});
