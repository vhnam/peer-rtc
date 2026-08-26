export const isUUID = (room_id: string) => {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    room_id,
  );
};

export const isURL = (room_id: string) => {
  return /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(room_id);
};
