import { useEffect, useState } from 'react';
export function useIsDesktop() {
  const query = '(min-width: 1280px)';
  const [is, setIs] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setIs(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return is;
}
