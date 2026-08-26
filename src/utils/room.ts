export const isValidCode = (room_id: string) => {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}$/.test(room_id);
};

export const isValidURL = (room_id: string) => {
  return /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(room_id);
};
