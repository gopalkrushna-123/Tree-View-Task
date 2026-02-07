import type {
  InputHTMLAttributes,
  KeyboardEvent,
  FocusEvent,
} from 'react';
import styles from '../../styles/Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onCommit?: (value: string) => void;
}

export function Input({
  onCommit,
  onKeyDown,
  onBlur,
  className,
  ...props
}: InputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onCommit) {
      e.preventDefault();
      onCommit((e.target as HTMLInputElement).value.trim());
    }
    onKeyDown?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (onCommit) onCommit(e.target.value.trim());
    onBlur?.(e);
  };

  const classNames = [styles.input, className].filter(Boolean).join(' ');
  return (
    <input
      className={classNames}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      autoFocus
      {...props}
    />
  );
}
