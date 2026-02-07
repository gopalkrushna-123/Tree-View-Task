import styles from '../../../styles/LetterAvatar.module.css';

export interface LetterAvatarProps {
  letter: string;
  isRoot?: boolean;
  className?: string;
  'aria-hidden'?: boolean;
}

export function LetterAvatar({
  letter,
  isRoot = false,
  className = '',
  ...rest
}: LetterAvatarProps) {
  const displayLetter = (letter?.charAt(0) || '?').toUpperCase();
  const classNames = [styles.avatar, isRoot && styles.avatarRoot, className].filter(Boolean).join(' ');
  return <span className={classNames} {...rest}>{displayLetter}</span>;
}
