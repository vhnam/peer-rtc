export const ROOM_CODE_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}$/;

export const isValidCode = (room_id: string) => {
  return ROOM_CODE_PATTERN.test(room_id);
};

export const isValidURL = (room_id: string) => {
  return /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(room_id);
};
