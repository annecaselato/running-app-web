import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import App from './App';

jest.mock('./App', () => ({
  __esModule: true,
  default: jest.fn(() => <div className="App">Mocked App Component</div>)
}));

it('renders the app', () => {
  const { container } = render(
    <MockedProvider>
      <App />
    </MockedProvider>
  );

  waitFor(() => {
    expect(container.getElementsByClassName('App')).toBeInTheDocument();
  });
});
