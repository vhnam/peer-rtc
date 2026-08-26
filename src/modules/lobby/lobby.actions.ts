import { LobbySchema } from "#/schemas/lobby.schema";
import { useForm } from "@formisch/react";
import { useRouter } from "@tanstack/react-router";

export const useLobbyActions = () => {
  const router = useRouter();

  const form = useForm({
    schema: LobbySchema,
    initialInput: {
      room_id: "",
    },
  });

  const joinRoomByCode = async (code: string) => {
    await router.navigate({ to: `/${code}` });
  };

  const joinRoomByURL = async (url: string) => {
    await router.navigate({ to: url });
  };

  const createNewRoom = async () => {
    await router.navigate({ to: `/${crypto.randomUUID()}` });
  };

  return {
    form,
    joinRoomByCode,
    joinRoomByURL,
    createNewRoom,
  };
};
