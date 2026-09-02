import { createFileRoute } from '@tanstack/react-router';

import { SettingsAppearance } from '#/modules/settings/settings-appearance';

export const Route = createFileRoute('/_protected/settings')({
  component: SettingsRoute,
});

function SettingsRoute() {
  return (
    <div className="py-4">
      <SettingsAppearance />
    </div>
  );
}
