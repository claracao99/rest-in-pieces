import { useEffect, useState } from 'react';
import { MOBILE_BREAKPOINT_PX } from '../lib/constants';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => window.innerWidth < MOBILE_BREAKPOINT_PX);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT_PX);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile;
}
