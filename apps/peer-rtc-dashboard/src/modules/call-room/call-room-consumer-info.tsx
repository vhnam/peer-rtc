import type { CallRoomConsumerInfoProps } from './call-room.types';

export const CallRoomConsumerInfo = ({ consultRequest }: CallRoomConsumerInfoProps) => {
  return (
    <div className="ml-auto h-full pb-4">
      <div className="border border-border bg-sidebar p-4 h-full  w-(--sidebar-width)">
        <div className="flex flex-col gap-6">
          <div className="text-sm font-medium font-heading">Consumer Info</div>
          <div className="flex flex-col">
            <div className="text-xs font-medium">Name</div>
            <div className="text-xs text-muted-foreground">{consultRequest.consumer.name}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs font-medium">Email</div>
            <div className="text-xs text-muted-foreground">{consultRequest.consumer.email}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs font-medium">Note</div>
            <div className="text-xs text-muted-foreground">{consultRequest.note}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
