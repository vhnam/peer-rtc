import * as v from 'valibot';

export const LobbySchema = v.object({
  room_id: v.union(
    [v.pipe(v.string(), v.trim(), v.uuid()), v.pipe(v.string(), v.trim(), v.url())],
    'Enter a valid code or link.',
  ),
});
