import { createFileRoute } from '@tanstack/react-router';

import { Room } from '#/modules/room';

export const Route = createFileRoute('/$roomId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { roomId } = Route.useParams();

  return <Room roomId={roomId} />;
}
