import { createFileRoute } from '@tanstack/react-router';

import { isValidCode } from '#/lib/utils';
import { Room } from '#/modules/room';

export const Route = createFileRoute('/_protected/$roomId')({
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
