import type { UseConfirmDialogReturn } from "~/components/contexts/confirm/use-dialog";
import type { PendingButtonProps } from "~/components/ui/button";

import { useCallback, useState } from "react";

import {
  AlertDialog,
  AlertDialogActionHeadless,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { PendingButton } from "~/components/ui/button";

export interface ConfirmDialogProps
  extends UseConfirmDialogReturn,
    Pick<PendingButtonProps, "variant"> {
  onContinue?(): Promise<void>;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  setIsOpen,
  onContinue,
  variant = "destructive",
}) => {
  const [isPending, setIsPending] = useState(false);

  const _onContinue = useCallback(async () => {
    try {
      setIsPending(true);
      await onContinue?.();
    } finally {
      setIsPending(false);
      setIsOpen(false);
    }
  }, [onContinue, setIsOpen]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. Are you absolutely sure?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogActionHeadless asChild>
            <PendingButton
              variant={variant}
              pending={isPending}
              onClick={_onContinue}
            >
              Continue
            </PendingButton>
          </AlertDialogActionHeadless>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ConfirmDialog };
