import { CheckIcon, MonitorCogIcon, MoonIcon, SunIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@peer-rtc/ui/components/card';
import { useTheme } from '@peer-rtc/ui/hooks/use-theme';
import { cn } from '@peer-rtc/ui/lib/utils';

import { switchThemeWithTransition, type AppTheme } from '#/lib/theme';

type Theme = AppTheme;

const themeOptions: {
  value: Theme;
  label: string;
  icon: ReactNode;
  preview: [string, string, string];
}[] = [
  {
    value: 'light',
    label: 'Light',
    icon: <SunIcon className="size-3.5 text-muted-foreground" />,
    preview: ['bg-gray-100', 'bg-white', 'bg-gray-200'],
  },
  {
    value: 'system',
    label: 'System',
    icon: <MonitorCogIcon className="size-3.5 text-muted-foreground" />,
    preview: ['bg-gray-300', 'bg-gray-100', 'bg-gray-400'],
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <MoonIcon className="size-3.5 text-muted-foreground" />,
    preview: ['bg-zinc-900', 'bg-zinc-800', 'bg-zinc-700'],
  },
];

function ThemePreview({ preview }: { preview: [string, string, string] }) {
  return (
    <div className={cn('flex h-10 w-full flex-col gap-1 overflow-hidden rounded-lg p-1.5', preview[0])}>
      <div className={cn('h-2 w-full rounded', preview[1])} />
      <div className={cn('h-1.5 w-3/4 rounded', preview[2])} />
    </div>
  );
}

function ThemeOption({
  value,
  label,
  icon,
  preview,
  selected,
  onSelect,
}: (typeof themeOptions)[number] & {
  selected: boolean;
  onSelect: (value: Theme) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={selected}
      className={cn(
        'flex flex-col gap-2.5 rounded-xl border-2 p-3 transition-all',
        selected ? 'border-foreground' : 'border-border hover:border-muted-foreground/40',
      )}
    >
      <ThemePreview preview={preview} />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-xs font-medium">{label}</span>
        </div>
        {selected && (
          <div className="flex size-3.5 items-center justify-center rounded-full bg-foreground">
            <CheckIcon className="size-2.5 text-background" />
          </div>
        )}
      </div>
    </button>
  );
}

function SettingsAppearance() {
  const { theme = 'system', setTheme } = useTheme();

  function handleThemeSelect(value: Theme) {
    if (value === theme) {
      return;
    }

    switchThemeWithTransition(setTheme, value);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="font-heading text-2xl font-semibold">Appearance</h1>
        <p className="text-sm text-muted-foreground">Choose your preferred color theme.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {themeOptions.map((option) => (
              <ThemeOption
                key={option.value}
                {...option}
                selected={theme === option.value}
                onSelect={handleThemeSelect}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { SettingsAppearance };
