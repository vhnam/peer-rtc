import { useForm } from '@formisch/react';
import { useRouter } from '@tanstack/react-router';

import { LobbySchema } from '#/schemas/lobby.schema';

export const useLobbyActions = () => {
  const router = useRouter();

  const form = useForm({
    schema: LobbySchema,
    initialInput: {
      room_id: '',
    },
  });

  const joinRoomByCode = async (code: string) => {
    await router.navigate({ to: `/${code}` });
  };

  const joinRoomByURL = async (url: string) => {
    await router.navigate({ to: url });
  };

  const createNewRoom = async () => {
    const code = crypto.randomUUID();
    await router.navigate({ to: `/${code}` });
  };

  return {
    form,
    joinRoomByCode,
    joinRoomByURL,
    createNewRoom,
  };
};
