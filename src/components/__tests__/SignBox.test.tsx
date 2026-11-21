import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SignBox } from '../cards/SignBox';

describe('SignBox Component (Kartu Isyarat Interaktif)', () => {
  it('merender huruf kapital dan label sistem SIBI dengan benar', () => {
    render(<SignBox letter="A" system="SIBI" />);

    expect(screen.getByText('A')).toBeDefined();
    expect(screen.getByText('SIBI')).toBeDefined();
  });

  it('merender huruf kapital dan label sistem BISINDO dengan benar', () => {
    render(<SignBox letter="B" system="BISINDO" />);

    expect(screen.getByText('B')).toBeDefined();
    expect(screen.getByText('BISINDO')).toBeDefined();
  });

  it('menerima interaksi klik pengguna', () => {
    const handleClick = vi.fn();
    render(<SignBox letter="W" system="SIBI" onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('menerapkan kelas visual aktif saat isActive bernilai true', () => {
    const { container } = render(<SignBox letter="C" system="SIBI" isActive={true} />);
    const box = container.firstChild as HTMLElement;
    expect(box.className).toContain('ring-brand');
  });
});
