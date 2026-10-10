import type {ReactNode} from 'react';

// One layout for every UI Kit demo: heading, real import lines, then the live sample.
// imports maps a file in src/shared/ui to the names it exports, e.g. {button: 'Button'}.
export function DemoSection({
  id,
  title,
  imports,
  children
}: {
  id: string;
  title: string;
  imports: Record<string, string>;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-8 space-y-4">
      <div className="space-y-1">
        <h2 id={`${id}-title`} className="text-xl font-medium">
          {title}
        </h2>
        {Object.entries(imports).map(([file, names]) => (
          <code key={file} className="block break-all text-xs text-muted-foreground">
            {`import {${names}} from '@/shared/ui/${file}';`}
          </code>
        ))}
      </div>
      {children}
    </section>
  );
}
