import { Workflow } from 'lucide-react';

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <Workflow className="size-5 text-primary" />
        <h1 className="text-lg font-semibold">Workflow Builder</h1>
      </div>
    </header>
  );
}
