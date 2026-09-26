'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DeleteConfirmModalProps {
  open: boolean;
  taskTitle: string;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  open,
  taskTitle,
  deleting,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <Modal open={open} onClose={onCancel} title="Delete Task">
      <p className="text-[var(--foreground-muted)] text-sm mb-6">
        Are you sure you want to delete{' '}
        <span className="text-[var(--foreground)] font-medium">&ldquo;{taskTitle}&rdquo;</span>?
        This action cannot be undone.
      </p>
      <div className="flex gap-2">
        <Button variant="danger" loading={deleting} onClick={onConfirm} className="flex-1">
          Delete
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={deleting} className="flex-1">
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
