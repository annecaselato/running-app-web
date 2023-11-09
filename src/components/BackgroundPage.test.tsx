import { render, screen } from '@testing-library/react';
import BackgroundPage from './BackgroundPage';

describe('BackgroundPage', () => {
  const props = {
    image: 'test-image.jpg',
    children: <div>Test Content</div>
  };

  it('renders BackgroundPage with provided props', () => {
    render(<BackgroundPage {...props} />);

    const backgroundImage = screen.getByTestId('background-image');
    expect(backgroundImage).toBeInTheDocument();

    const content = screen.getByText('Test Content');
    expect(content).toBeInTheDocument();
  });
});
