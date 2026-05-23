import { Scene } from './components/Scene';
import { MobileWarning } from './components/MobileWarning';
import { useIsMobile } from './hooks/useIsMobile';

export default function App() {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileWarning />;
  return <Scene />;
}
