interface Props {
  entry: { id: number; text: string } | null;
}

export function Subtitle({ entry }: Props) {
  if (!entry) return null;
  return (
    <div key={entry.id} className="subtitle" aria-hidden>
      {entry.text}
    </div>
  );
}
