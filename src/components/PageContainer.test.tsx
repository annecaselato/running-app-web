import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import PageContainer from './PageContainer';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderPage = () => {
  // eslint-disable-next-line react/no-children-prop
  render(<PageContainer title="My Page" children={<div>Page content</div>} />);
};

describe('PageContainer', () => {
  it('renders without errors', () => {
    renderPage();

    expect(screen.getByText('My Page')).toBeInTheDocument();
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('handles opening and closing the drawer', async () => {
    renderPage();

    const openButton = screen.getByLabelText('open drawer');
    const closeButton = screen.getByLabelText('close drawer');

    expect(openButton).toBeVisible();
    expect(closeButton).not.toBeVisible();

    act(() => {
      fireEvent.click(openButton);
    });

    await waitFor(() => {
      expect(openButton).not.toBeVisible();
      expect(closeButton).toBeVisible();
    });

    act(() => {
      fireEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(openButton).toBeVisible();
      expect(closeButton).not.toBeVisible();
    });
  });
});
