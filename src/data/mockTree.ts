import type { TreeNode } from '../types/tree';

const createNode = (
  id: string,
  label: string,
  children: TreeNode[] = [],
  isLazy = false,
  level = 0,
  expanded?: boolean
): TreeNode => ({
  id,
  label,
  children,
  isLazy,
  level,
  ...(expanded !== undefined && { expanded }),
});

export const initialMockTree: TreeNode[] = [
  createNode('root-1', 'Level A', [
    createNode('b-1', 'Level B', [
      createNode('c-1', 'Level C', [], false, 2),
      createNode('c-2', 'Level C', [], false, 2),
      createNode('d-1', 'Level D', [
        createNode('c-3', 'Level C', [], false, 3),
        createNode('c-4', 'Level C', [], false, 3),
      ], false, 2, true),
    ], false, 1, true),
    createNode('b-2', 'Level B', [], true, 1),
  ], false, 0, true),
];

export const simulateLazyLoad = (parentId: string): Promise<TreeNode[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        createNode(`${parentId}-child-1`, 'Level C', [], false, 2),
        createNode(`${parentId}-child-2`, 'Level D', [], true, 2),
      ]);
    }, 600);
  });
};
