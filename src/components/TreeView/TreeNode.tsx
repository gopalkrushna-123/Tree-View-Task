import { useState, useEffect, type MouseEvent } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import type { TreeNode as TreeNodeType } from '../../types/tree';
import { IconAdd, IconEdit } from '../../assets/icons';
import { LetterAvatar } from '../ui/LetterAvatar';
import { ExpandChevron } from '../ui/ExpandChevron';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import styles from '../../styles/TreeNode.module.css';

export interface TreeNodeProps {
  node: TreeNodeType;
  onExpand: (nodeId: string) => void;
  onLazyLoad: (nodeId: string) => void;
  onAddChild: (parentId: string, label: string) => void;
  onRemove: (nodeId: string, label: string) => void;
  onEdit: (nodeId: string, label: string) => void;
}

export function TreeNode({
  node,
  onExpand,
  onLazyLoad,
  onAddChild,
  onRemove,
  onEdit,
}: TreeNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addValue, setAddValue] = useState('');
  const [editValue, setEditValue] = useState(node.label);

  const hasChildren = node.children.length > 0 || Boolean(node.isLazy);
  const expanded = node.expanded ?? false;
  const isLoading = Boolean(node.isLazy) && !node.loaded && expanded;

  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: node.id,
    data: { nodeId: node.id },
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `drop-${node.id}-child`,
    data: { targetId: node.id, position: 'child' as const },
  });

  const { setNodeRef: setDropBeforeRef } = useDroppable({
    id: `drop-${node.id}-before`,
    data: { targetId: node.id, position: 'before' as const },
  });

  useEffect(() => {
    setEditValue(node.label);
  }, [node.label]);

  const handleToggle = () => {
    if (!hasChildren) return;
    onExpand(node.id);
    if (node.isLazy && !node.loaded) onLazyLoad(node.id);
  };

  const handleAddCommit = (value: string) => {
    if (value.trim()) onAddChild(node.id, value.trim());
    setIsAdding(false);
    setAddValue('');
  };

  const handleEditCommit = (value: string) => {
    if (value.trim()) onEdit(node.id, value.trim());
    setIsEditing(false);
  };

  const handleRowClick = (e: MouseEvent) => {
    if (hasChildren && !(e.target as HTMLElement).closest('button, input')) {
      handleToggle();
    }
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    onRemove(node.id, node.label);
  };

  const handleExpandClick = (e: MouseEvent) => {
    e.stopPropagation();
    handleToggle();
  };

  const letter = node.label.charAt(0) || '?';
  const isRoot = node.level === 0;
  const rowClass = [styles.row, isDragging && styles.dragging, isOver && styles.dropOver]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={styles.nodeItem}>
      <div
        ref={setDropBeforeRef}
        className={styles.dropBefore}
        data-drop-position="before"
      />
      <div
        ref={setDragRef}
        className={rowClass}
        data-level={node.level}
        onClick={handleRowClick}
        onContextMenu={handleContextMenu}
        {...attributes}
        {...listeners}
      >
        <div className={styles.rowInner} ref={setDropRef}>
          <button
            type="button"
            className={styles.expandBtn}
            onClick={handleExpandClick}
            aria-expanded={hasChildren ? expanded : undefined}
            aria-label={hasChildren ? (expanded ? 'Collapse' : 'Expand') : undefined}
          >
            {hasChildren ? (
              <ExpandChevron expanded={expanded} />
            ) : (
              <span className={styles.expandPlaceholder} aria-hidden />
            )}
          </button>
          <LetterAvatar letter={letter} isRoot={isRoot} />
          <div className={styles.labelCell}>
            {isEditing ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onCommit={handleEditCommit}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className={styles.label}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                {node.label}
              </span>
            )}
          </div>
          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            <Button
              variant="icon"
              className={styles.actionBtnIcon}
              aria-label="Edit"
              onClick={() => setIsEditing(true)}
            >
              <IconEdit />
            </Button>
            <Button
              variant="icon"
              className={styles.actionBtnAdd}
              aria-label="Add child"
              onClick={() => setIsAdding(true)}
            >
              <IconAdd />
            </Button>
          </div>
        </div>
      </div>
      {isAdding && (
        <div className={styles.addRow}>
          <Input
            value={addValue}
            onChange={(e) => setAddValue(e.target.value)}
            onCommit={handleAddCommit}
            placeholder="New node name"
          />
        </div>
      )}
      {expanded &&
        (isLoading ? (
          <div className={styles.loading}>Loading…</div>
        ) : (
          <ul className={styles.children}>
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                onExpand={onExpand}
                onLazyLoad={onLazyLoad}
                onAddChild={onAddChild}
                onRemove={onRemove}
                onEdit={onEdit}
              />
            ))}
          </ul>
        ))}
    </li>
  );
}
