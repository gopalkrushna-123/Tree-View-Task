import { Button } from '../ui/Button';
import styles from '../../styles/ConfirmDialog.module.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className={styles.dialog}>
        <h2 id="dialog-title" className={styles.title}>
          {title}
        </h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
