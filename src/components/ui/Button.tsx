import type { ButtonHTMLAttributes } from 'react';
import styles from '../../styles/Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'icon' | 'primary' | 'ghost';
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) {
  const classNames = [styles.btn, styles[variant], className].filter(Boolean).join(' ');
  return (
    <button type="button" className={classNames} {...props}>
      {children}
    </button>
  );
}
