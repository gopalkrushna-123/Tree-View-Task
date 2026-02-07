import addIconUrl from './add.svg?url';
import editIconUrl from './edit.svg?url';
import chevronDownUrl from './chevron-down.svg?url';
import chevronRightUrl from './chevron-right.svg?url';

export const Icons = {
  add: addIconUrl,
  edit: editIconUrl,
  chevronDown: chevronDownUrl,
  chevronRight: chevronRightUrl,
} as const;

interface IconImgProps {
  src: string;
  className?: string;
  width?: number;
  height?: number;
}

function IconImg({ src, className = '', width = 20, height = 20 }: IconImgProps) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      className={className}
      width={width}
      height={height}
    />
  );
}

export function IconAdd(props: Omit<IconImgProps, 'src'>) {
  return <IconImg src={Icons.add} width={20} height={20} {...props} />;
}

export function IconEdit(props: Omit<IconImgProps, 'src'>) {
  return <IconImg src={Icons.edit} width={20} height={20} {...props} />;
}

export function IconChevronDown(props: Omit<IconImgProps, 'src'>) {
  return <IconImg src={Icons.chevronDown} width={20} height={20} {...props} />;
}

export function IconChevronRight(props: Omit<IconImgProps, 'src'>) {
  return <IconImg src={Icons.chevronRight} width={20} height={20} {...props} />;
}
