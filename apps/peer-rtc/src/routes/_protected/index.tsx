import { createFileRoute } from '@tanstack/react-router';

import { LobbyPage } from '#/modules/lobby';

export const Route = createFileRoute('/_protected/')({
  component: LobbyPage,
});
