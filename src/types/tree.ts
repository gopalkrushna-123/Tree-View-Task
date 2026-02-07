export interface TreeNode {
  id: string;
  label: string;
  children: TreeNode[];
  isLazy?: boolean;
  level: number;
  expanded?: boolean;
  loaded?: boolean;
}

export type Tree = TreeNode[];
