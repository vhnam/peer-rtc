export const CONSULT_REQUEST_STATUSES = ['pending', 'accepted', 'closed', 'canceled'] as const;

export type ConsultRequestStatus = (typeof CONSULT_REQUEST_STATUSES)[number] | (string & {});

export const CONSULT_REQUEST_TIME_RANGES = [
  'today',
  'this-week',
  'next-week',
  'previous-week',
  'this-month',
  'next-month',
  'previous-month',
] as const;

export type ConsultRequestTimeRange = (typeof CONSULT_REQUEST_TIME_RANGES)[number];

export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type ConsultRequest = {
  id: string;
  requestId: string;
  consumerId: string;
  consumer: User;
  providerId: string | null;
  provider: User | null;
  status: ConsultRequestStatus;
  note: string | null;
  createdAt: string;
  acceptedAt: string | null;
  closedAt: string | null;
};

export const DEFAULT_CONSULT_REQUEST_PAGE = 1;
export const DEFAULT_CONSULT_REQUEST_LIMIT = 10;
export const MAX_CONSULT_REQUEST_LIMIT = 100;
export const DEFAULT_CONSULT_REQUEST_STATUS = 'pending' satisfies ConsultRequestStatus;
export const DEFAULT_CONSULT_REQUEST_TIME = 'today' satisfies ConsultRequestTimeRange;

export type ConsultRequestListParams = {
  page: number;
  limit: number;
  providerId: string;
  status?: ConsultRequestStatus;
  time: ConsultRequestTimeRange;
  requestId?: string;
};

export type ConsultRequestsSearch = Omit<ConsultRequestListParams, 'providerId'>;

export type UpdateConsultRequestPayload = {
  id: string;
  providerId: string;
  status: ConsultRequestStatus;
};

export type ConsultRequestListResult = {
  data: ConsultRequest[];
  total: number;
  page: number;
  limit: number;
};
