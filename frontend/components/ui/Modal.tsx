import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  maxWidth?: string;
  contentClassName?: string;
}

export default function Modal({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  maxWidth = "max-w-[566px]",
  contentClassName = "max-w-[438px]",
}: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out z-50" />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%_-_32px)] ${maxWidth} max-h-[calc(100dvh-32px)] overflow-y-auto rounded-3xl md:rounded-[30px] bg-white p-6  sm:p-8 md:p-12 shadow-2xl z-50 data-[state=open]:animate-content-show data-[state=closed]:animate-content-hide focus:outline-none`}
        >
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close modal"
              className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-950 hover:opacity-70 transition cursor-pointer focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </Dialog.Close>

          <div className={`mx-auto w-full ${contentClassName}`}>
            {title && (
              <Dialog.Title className="text-[32px] font-medium leading-[1.2] tracking-[-0.02em] text-foreground md:text-[40px]">
                {title}
              </Dialog.Title>
            )}

            {description && (
              <Dialog.Description className="mt-5 text-base leading-[1.25] text-(--color-muted)">
                {description}
              </Dialog.Description>
            )}

            <div className="mt-5">{children}</div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
