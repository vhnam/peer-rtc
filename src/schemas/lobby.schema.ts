import * as v from 'valibot';

import { ROOM_CODE_PATTERN } from '#/utils/room';

export const LobbySchema = v.object({
  room_id: v.union(
    [v.pipe(v.string(), v.trim(), v.regex(ROOM_CODE_PATTERN)), v.pipe(v.string(), v.trim(), v.url())],
    'Enter a valid code or link.',
  ),
});
