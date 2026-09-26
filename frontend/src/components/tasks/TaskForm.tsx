'use client';

import { useEffect, useRef, useState } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
}

interface TaskFormProps {
  initialData: TaskFormData;
  isEditing: boolean;
  submitting: boolean;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

export function TaskForm({ initialData, isEditing, submitting, onSubmit, onCancel }: TaskFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<TaskFormData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

  const isValid = formData.title.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        ref={titleRef}
        label="Title"
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="What needs to be done?"
      />
      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows={3}
        placeholder="Optional details..."
      />
      <Input
        label="Due Date"
        type="date"
        value={formData.dueDate}
        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
      />
      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={submitting} disabled={!isValid} className="flex-1">
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
