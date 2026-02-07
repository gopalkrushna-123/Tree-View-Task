import { useState, useCallback } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import type { Tree, TreeNode } from '../../types/tree';
import { initialMockTree, simulateLazyLoad } from '../../data/mockTree';
import {
  removeNodeFromTree,
  updateNodeById,
  insertChild,
  findNodeById,
  moveNode,
  getDropTarget,
} from '../../utils/treeUtils';
import { TreeNode as TreeNodeComponent } from './TreeNode';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';
import styles from '../../styles/TreeView.module.css';

export interface TreeViewProps {
  initialData?: Tree;
  title?: string;
  className?: string;
  onLazyLoad?: (nodeId: string) => Promise<TreeNode[]>;
}

export function TreeView({
  initialData,
  title = 'Tree View Component',
  className = '',
  onLazyLoad: onLazyLoadProp,
}: TreeViewProps) {
  const [tree, setTree] = useState<Tree>(initialData ?? initialMockTree);
  const [deleteConfirm, setDeleteConfirm] = useState<{ nodeId: string; label: string } | null>(null);
  const loadChildren = onLazyLoadProp ?? simulateLazyLoad;

  const handleExpand = useCallback((nodeId: string) => {
    setTree((prev) =>
      updateNodeById(prev, nodeId, (n) => ({ ...n, expanded: !n.expanded }))
    );
  }, []);

  const handleLazyLoad = useCallback(
    (nodeId: string) => {
      loadChildren(nodeId).then((children) => {
        setTree((prev) => {
          const parent = findNodeById(prev, nodeId);
          const level = parent ? parent.level + 1 : 0;
          return updateNodeById(prev, nodeId, (n) => ({
            ...n,
            children: children.map((c) => ({ ...c, level })),
            isLazy: false,
            loaded: true,
          }));
        });
      });
    },
    [loadChildren]
  );

  const handleAddChild = useCallback((parentId: string, label: string) => {
    if (!label.trim()) return;
    setTree((prev) => {
      const parent = findNodeById(prev, parentId);
      const level = parent ? parent.level + 1 : 0;
      const newNode: TreeNode = {
        id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        label: label.trim(),
        children: [],
        level,
      };
      return insertChild(prev, parentId, newNode);
    });
  }, []);

  const handleRemove = useCallback((nodeId: string) => {
    setDeleteConfirm(null);
    setTree((prev) => removeNodeFromTree(prev, nodeId));
  }, []);

  const handleEdit = useCallback((nodeId: string, label: string) => {
    if (!label.trim()) return;
    setTree((prev) => updateNodeById(prev, nodeId, (n) => ({ ...n, label: label.trim() })));
  }, []);

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    if (!over) return;
    const nodeId = active.id as string;
    const overData = over.data.current as
      | { targetId: string; position: 'child' | 'before' }
      | undefined;
    setTree((prev) => {
      const target = getDropTarget(prev, nodeId, overData);
      if (!target) return prev;
      return moveNode(prev, nodeId, target.targetParentId, target.targetIndex);
    });
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const wrapperClass = [styles.wrapper, className].filter(Boolean).join(' ');
  return (
    <div className={wrapperClass}>
      {title && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.treeContainer}>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <ul className={styles.list}>
            {tree.map((node) => (
              <TreeNodeComponent
                key={node.id}
                node={node}
                onExpand={handleExpand}
                onLazyLoad={handleLazyLoad}
                onAddChild={handleAddChild}
                onRemove={(id: string, label: string) => setDeleteConfirm({ nodeId: id, label })}
                onEdit={handleEdit}
              />
            ))}
          </ul>
        </DndContext>
      </div>
      <ConfirmDialog
        open={Boolean(deleteConfirm)}
        title="Remove node"
        message={
          deleteConfirm
            ? `Remove "${deleteConfirm.label}" and all its children? This cannot be undone.`
            : ''
        }
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (deleteConfirm) handleRemove(deleteConfirm.nodeId);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}

