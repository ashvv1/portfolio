import { render, screen } from '@testing-library/react';
import App from './App';

test('renders loading screen on mount', () => {
  render(<App />);
  const loadingImg = screen.getByAltText(/loading gif/i);
  expect(loadingImg).toBeInTheDocument();
  expect(loadingImg.closest('#loading-screen')).not.toBeNull();
});
