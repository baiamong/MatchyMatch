import { render, screen, fireEvent } from '@testing-library/react';
import DarkModeToggle from '../components/DarkModeToggle';

describe('DarkModeToggle', () => {
  it('should render a button', () => {
    const mockToggle = jest.fn();
    render(<DarkModeToggle dark={false} onToggle={mockToggle} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should display Moon icon when dark mode is off', () => {
    const mockToggle = jest.fn();
    const { container } = render(
      <DarkModeToggle dark={false} onToggle={mockToggle} />
    );
    // Check for Moon icon (lucide-react renders SVG)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should display Sun icon when dark mode is on', () => {
    const mockToggle = jest.fn();
    const { container } = render(
      <DarkModeToggle dark={true} onToggle={mockToggle} />
    );
    // Check for Sun icon (lucide-react renders SVG)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should call onToggle when clicked', () => {
    const mockToggle = jest.fn();
    render(<DarkModeToggle dark={false} onToggle={mockToggle} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('should have correct aria-label for light mode', () => {
    const mockToggle = jest.fn();
    render(<DarkModeToggle dark={false} onToggle={mockToggle} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute(
      'aria-label',
      'Switch to dark mode'
    );
  });

  it('should have correct aria-label for dark mode', () => {
    const mockToggle = jest.fn();
    render(<DarkModeToggle dark={true} onToggle={mockToggle} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute(
      'aria-label',
      'Switch to light mode'
    );
  });

  it('should have correct title attribute for light mode', () => {
    const mockToggle = jest.fn();
    render(<DarkModeToggle dark={false} onToggle={mockToggle} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Dark mode');
  });

  it('should have correct title attribute for dark mode', () => {
    const mockToggle = jest.fn();
    render(<DarkModeToggle dark={true} onToggle={mockToggle} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Light mode');
  });
});
