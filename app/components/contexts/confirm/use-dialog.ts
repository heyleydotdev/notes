import { useCallback, useState } from "react";

export interface UseConfirmDialogReturn {
  isOpen: boolean;
  setIsOpen(open: boolean): void;
  open(): void;
}

export const useConfirmDialog = (): UseConfirmDialogReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);

  return { open, isOpen, setIsOpen };
};
