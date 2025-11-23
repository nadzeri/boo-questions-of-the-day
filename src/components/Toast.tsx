import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  timeout?: number;
  onHide?: () => void;
};

export default function Toast({ message, timeout = 1000, onHide }: ToastProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onHide?.();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onHide]);

  if (!show) return null;

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 bg-accent text-primary px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap z-50 opacity-100 transition-opacity duration-300">
      {message}
    </div>
  );
}

