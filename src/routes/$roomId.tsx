import { createFileRoute } from '@tanstack/react-router';

import { Room } from '#/modules/room';
import { isValidCode } from '#/utils/room';

export const Route = createFileRoute('/$roomId')({
  params: {
    parse: ({ roomId }) => {
      if (!isValidCode(roomId)) {
        return false;
      }

      return { roomId };
    },
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { roomId } = Route.useParams();

  return <Room roomId={roomId} />;
}
