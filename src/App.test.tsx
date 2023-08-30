import { render, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('./AppRoutes', () => ({
  __esModule: true,
  default: jest.fn(() => <div className="AppRoutes">Mocked App Routes Component</div>)
}));

jest.mock('@mui/material/styles/ThemeProvider', () => ({
  __esModule: true,
  default: jest.fn(() => <div className="ThemeProvider">Mocked Theme Provider Component</div>)
}));

describe('App', () => {
  it('renders app routes', () => {
    const { container } = render(<App />);

    waitFor(() => {
      expect(container.getElementsByClassName('AppRoutes')).toBeInTheDocument();
    });
  });
});
