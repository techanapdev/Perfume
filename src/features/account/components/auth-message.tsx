export function AuthMessage({text, tone}: {text: string | null; tone: 'error' | 'info'}) {
  if (!text) return null;
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={tone === 'error' ? 'text-sm text-destructive' : 'text-sm text-muted-foreground'}
    >
      {text}
    </p>
  );
}
