import { useState, useCallback } from 'react';
import Toast from './Toast';

let toastId = 0;

export default function ToastContainer() {
  const [toasts, setToasts] = useState<{id:number,message:string,type?:'success'|'error'|'info'}[]>([]);

  const addToast = useCallback((message:string, type?:'success'|'error'|'info') => {
    const id = toastId++;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = (id:number) => setToasts(prev => prev.filter(t => t.id !== id));

  // Expose globally
  if (typeof window !== 'undefined') (window as any).addToast = addToast;

  return (
    <>
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </>
  );
}
