import type { TreeNode, Tree } from '../types/tree';

export function findNodeById(nodes: Tree, id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNodeById(node.children, id);
    if (found) return found;
  }
  return null;
}

export function getNodePath(nodes: Tree, nodeId: string): TreeNode[] {
  for (const node of nodes) {
    if (node.id === nodeId) return [node];
    const pathFromChild = getNodePath(node.children, nodeId);
    if (pathFromChild.length > 0) return [node, ...pathFromChild];
  }
  return [];
}

export function getParentId(nodes: Tree, nodeId: string): string | null {
  const path = getNodePath(nodes, nodeId);
  if (path.length <= 1) return null;
  return path[path.length - 2].id;
}

export function getIndexInParent(nodes: Tree, nodeId: string): number {
  for (const [i, node] of nodes.entries()) {
    if (node.id === nodeId) return i;
    const indexInChild = getIndexInParent(node.children, nodeId);
    if (indexInChild >= 0) return indexInChild;
  }
  return -1;
}

export function isDescendantOf(
  nodes: Tree,
  descendantId: string,
  ancestorId: string
): boolean {
  const path = getNodePath(nodes, descendantId);
  return path.some((node) => node.id === ancestorId);
}

export function updateNodeById(
  nodes: Tree,
  id: string,
  updater: (node: TreeNode) => TreeNode
): Tree {
  return nodes.map((node) => {
    if (node.id === id) return updater(node);
    return {
      ...node,
      children: updateNodeById(node.children, id, updater),
    };
  });
}

export function insertChild(
  nodes: Tree,
  parentId: string | null,
  child: TreeNode,
  index?: number
): Tree {
  if (parentId === null) {
    const at = index ?? nodes.length;
    const next = [...nodes];
    next.splice(at, 0, child);
    return next;
  }

  return nodes.map((node) => {
    if (node.id !== parentId) {
      return {
        ...node,
        children: insertChild(node.children, parentId, child, index),
      };
    }
    const at = index ?? node.children.length;
    const nextChildren = [...node.children];
    nextChildren.splice(at, 0, child);
    return { ...node, children: nextChildren };
  });
}

export function removeNodeFromTree(nodes: Tree, nodeId: string): Tree {
  return nodes
    .filter((node) => node.id !== nodeId)
    .map((node) => ({
      ...node,
      children: removeNodeFromTree(node.children, nodeId),
    }));
}

function applyLevelsToTree(nodes: Tree, level: number): Tree {
  return nodes.map((node) => ({
    ...node,
    level,
    children: applyLevelsToTree(node.children, level + 1),
  }));
}

export interface DropTarget {
  targetParentId: string | null;
  targetIndex: number;
}

export function getDropTarget(
  nodes: Tree,
  draggedNodeId: string,
  overData: { targetId: string; position: 'child' | 'before' } | undefined
): DropTarget | null {
  if (!overData) return null;
  const { targetId, position } = overData;
  if (targetId === draggedNodeId) return null;
  if (position === 'child' && isDescendantOf(nodes, targetId, draggedNodeId)) return null;

  if (position === 'child') {
    const targetNode = findNodeById(nodes, targetId);
    return {
      targetParentId: targetId,
      targetIndex: targetNode ? targetNode.children.length : 0,
    };
  }

  const targetParentId = getParentId(nodes, targetId);
  let targetIndex = getIndexInParent(nodes, targetId);
  const draggedParentId = getParentId(nodes, draggedNodeId);
  const draggedIndex = getIndexInParent(nodes, draggedNodeId);
  if (targetParentId === draggedParentId && draggedIndex < targetIndex) {
    targetIndex -= 1;
  }
  return { targetParentId, targetIndex };
}

export function moveNode(
  nodes: Tree,
  nodeId: string,
  targetParentId: string | null,
  targetIndex: number
): Tree {
  const path = getNodePath(nodes, nodeId);
  if (path.length === 0) return nodes;

  const nodeToMove = path[path.length - 1];
  const wouldCreateCycle =
    targetParentId !== null && isDescendantOf(nodes, targetParentId, nodeId);
  if (wouldCreateCycle) return nodes;

  const afterRemove = removeNodeFromTree(nodes, nodeId);
  const afterInsert = insertChild(
    afterRemove,
    targetParentId,
    { ...nodeToMove },
    targetIndex
  );

  return applyLevelsToTree(afterInsert, 0);
}
