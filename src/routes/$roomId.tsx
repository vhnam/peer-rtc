import { Room } from "#/modules/room";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$roomId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { roomId } = Route.useParams();

  return <Room roomId={roomId} />;
}
