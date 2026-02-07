import type { HTMLAttributes } from 'react';
import { IconChevronDown, IconChevronRight } from '../../../assets/icons';
import styles from '../../../styles/ExpandChevron.module.css';

export interface ExpandChevronProps extends HTMLAttributes<HTMLSpanElement> {
  expanded: boolean;
}

export function ExpandChevron({ expanded, className, ...rest }: ExpandChevronProps) {
  const classNames = [styles.chevron, className].filter(Boolean).join(' ');
  return (
    <span className={classNames} aria-hidden {...rest}>
      {expanded ? <IconChevronDown /> : <IconChevronRight />}
    </span>
  );
}
