interface Props {
  sfxOn: boolean;
  onToggle: () => void;
}

export function IconCluster({ sfxOn, onToggle }: Props) {
  return (
    <nav className="icon-cluster" aria-label="Memorial actions">
      <button
        className="icon-btn"
        onClick={onToggle}
        aria-label={sfxOn ? 'Mute sound effects' : 'Unmute sound effects'}
      >
        <span className={`icon icon--music ${sfxOn ? 'on' : 'off'}`} />
      </button>
    </nav>
  );
}
