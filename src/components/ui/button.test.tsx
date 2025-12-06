import { describe, it, expect } from 'vitest';

import { render, screen } from '@/test/utils';

import { Button } from './button';

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<Button className="custom-class">Click me</Button>);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders as disabled when disabled prop is passed', () => {
    render(<Button disabled>Click me</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick handler when clicked', async () => {
    let clicked = false;
    const { user } = render(<Button onClick={() => (clicked = true)}>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(clicked).toBe(true);
  });
});
