import { render, fireEvent, screen } from '@testing-library/react';
import AlertDialog from './Alert';

describe('AlertDialog', () => {
  const handleClose = jest.fn();
  const action = jest.fn();

  const defaultProps = {
    title: 'Test Title',
    text: 'Test Text',
    open: true,
    handleClose,
    action
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with the provided title and text', () => {
    render(<AlertDialog {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  it('calls handleClose when "Cancel" button is clicked', () => {
    render(<AlertDialog {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls handleClose and action when "OK" button is clicked', () => {
    render(<AlertDialog {...defaultProps} />);
    fireEvent.click(screen.getByText('OK'));
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(action).toHaveBeenCalledTimes(1);
  });
});
