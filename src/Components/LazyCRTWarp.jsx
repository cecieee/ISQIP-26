import { lazy, Suspense, useEffect, useState } from 'react';

const loadCRTWarp = () => import('./CRTWarp');
const CRTWarp = lazy(loadCRTWarp);

export default function LazyCRTWarp({ active = true, delay = 0, preload = false, ...props }) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!active && !preload) return undefined;

    let timeoutId;
    let idleId;
    const load = () => {
      if (preload) loadCRTWarp();
      if (active) setShouldLoad(true);
    };

    if (delay > 0) {
      timeoutId = window.setTimeout(load, delay);
    } else if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(load, { timeout: 1000 });
    } else {
      timeoutId = window.setTimeout(load, 1);
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [active, delay, preload]);

  if (!shouldLoad) return null;

  return (
    <Suspense fallback={null}>
      <CRTWarp {...props} />
    </Suspense>
  );
}
