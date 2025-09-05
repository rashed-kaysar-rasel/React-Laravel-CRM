import { useState } from 'react';

export function useConfirm<T = number>() {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<T | null>(null);

  const ask = (data: T) => { setPayload(data); setOpen(true); };
  const close = () => { setOpen(false); setPayload(null); };

  return { open, payload, ask, close };
}