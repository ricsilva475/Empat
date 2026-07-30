import { toast } from "sonner";

export function confirmToast(message, onConfirm, opts = {}) {
  const {
    description = "Esta ação não pode ser desfeita.",
    confirmLabel = "Eliminar",
    cancelLabel = "Cancelar",
    duration = 8000,
  } = opts;

  toast(message, {
    description,
    duration,
    action: {
      label: confirmLabel,
      onClick: () => {
        try { onConfirm(); } catch (e) { /* noop */ }
      },
    },
    cancel: {
      label: cancelLabel,
      onClick: () => {},
    },
    classNames: {
      actionButton: "!bg-red-600 !text-white",
    },
  });
}
