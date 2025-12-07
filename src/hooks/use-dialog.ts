'use client';

import { useCallback, useState } from 'react';

interface UseDialogReturn<TType extends string, TData> {
  /** Currently open dialog type, null if none */
  dialogType: TType | null;
  /** Data associated with current dialog */
  dialogData: TData | null;
  /** Open a dialog with optional data */
  openDialog: (type: TType, data?: TData) => void;
  /** Close current dialog */
  closeDialog: () => void;
  /** Check if specific dialog is open */
  isOpen: (type: TType) => boolean;
}

/**
 * Generic dialog state hook ensuring only one dialog is open at a time.
 *
 * @template TType - Union type of dialog identifiers (e.g., 'node-selection' | 'node-configuration')
 * @template TData - Type of data passed to dialogs
 *
 * @example
 * // Define types for your feature
 * type MyDialogType = 'create' | 'edit' | 'delete';
 * interface MyDialogData { itemId?: string; }
 *
 * // Use the hook
 * const { openDialog, closeDialog, dialogType, dialogData } = useDialog<MyDialogType, MyDialogData>();
 * openDialog('edit', { itemId: '123' });
 */
export function useDialog<
  TType extends string = string,
  TData = Record<string, unknown>,
>(): UseDialogReturn<TType, TData> {
  const [dialogType, setDialogType] = useState<TType | null>(null);
  const [dialogData, setDialogData] = useState<TData | null>(null);

  const openDialog = useCallback((type: TType, data?: TData) => {
    setDialogType(type);
    setDialogData(data ?? null);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogType(null);
    setDialogData(null);
  }, []);

  const isOpen = useCallback((type: TType) => dialogType === type, [dialogType]);

  return {
    dialogType,
    dialogData,
    openDialog,
    closeDialog,
    isOpen,
  };
}
