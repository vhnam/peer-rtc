export const fieldErrorMessage = (errors: unknown[] | null | undefined) => {
  const first = errors?.[0];
  if (typeof first === 'string') {
    return first;
  }
  if (first && typeof first === 'object' && 'message' in first && typeof first.message === 'string') {
    return first.message;
  }
  return undefined;
};

export const ROOM_CODE_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const isValidCode = (room_id: string) => {
  return ROOM_CODE_PATTERN.test(room_id);
};

export const isValidURL = (room_id: string) => {
  return /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(room_id);
};
