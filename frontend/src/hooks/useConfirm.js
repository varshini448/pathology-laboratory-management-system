import { useCallback, useState } from "react";

const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({
    title: "Confirm Action",
    message: "Are you sure you want to continue?",
  });
  const [resolver, setResolver] = useState(null);

  const confirm = useCallback((config = {}) => {
    return new Promise((resolve) => {
      setOptions({
        title: config.title || "Confirm Action",
        message:
          config.message || "Are you sure you want to continue?",
        confirmText: config.confirmText || "Confirm",
        cancelText: config.cancelText || "Cancel",
        variant: config.variant || "primary",
      });

      setResolver(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    resolver?.(true);
    setResolver(null);
    setIsOpen(false);
  }, [resolver]);

  const handleCancel = useCallback(() => {
    resolver?.(false);
    setResolver(null);
    setIsOpen(false);
  }, [resolver]);

  return {
    isOpen,
    options,
    confirm,
    handleConfirm,
    handleCancel,
  };
};

export default useConfirm;