import { render, screen, fireEvent } from '@testing-library/react';
import ActionCard from './ActionCard';

describe('ActionCard', () => {
  const mockOnClick = jest.fn();

  const props = {
    title: 'Test Title',
    description: 'Test Description',
    image: 'test-image.jpg',
    onClick: mockOnClick
  };

  it('renders ActionCard with provided props', () => {
    render(<ActionCard {...props} />);

    const titleElement = screen.getByText(props.title);
    const descriptionElement = screen.getByText(props.description);
    const imageElement = screen.getByRole('img');

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
    expect(imageElement).toBeInTheDocument();
  });

  it('calls onClick handler when the card is clicked', () => {
    render(<ActionCard {...props} />);

    const cardActionArea = screen.getByRole('button');

    fireEvent.click(cardActionArea);
    expect(mockOnClick).toHaveBeenCalled();
  });
});
