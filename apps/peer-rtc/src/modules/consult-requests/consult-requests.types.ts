import * as v from 'valibot';

export const CONSULT_REQUEST_STATUSES = ['pending', 'accepted', 'closed', 'cancelled'] as const;

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
export const DEFAULT_CONSULT_REQUEST_LIMIT = 20;
export const MAX_CONSULT_REQUEST_LIMIT = 100;
export const DEFAULT_CONSULT_REQUEST_STATUS = 'pending' satisfies ConsultRequestStatus;
export const DEFAULT_CONSULT_REQUEST_TIME = 'this-week' satisfies ConsultRequestTimeRange;

export type ConsultRequestListParams = {
  page: number;
  limit: number;
  consumerId: string;
  status: ConsultRequestStatus;
  time: ConsultRequestTimeRange;
  requestId?: string;
};

export type ConsultRequestsSearch = {
  page?: number;
  limit?: number;
  status?: ConsultRequestStatus;
  time?: ConsultRequestTimeRange;
  requestId?: string;
};

export type ConsultRequestListResult = {
  data: ConsultRequest[];
  total: number;
  page: number;
  limit: number;
};

export const CreateConsultRequestSchema = v.object({
  note: v.pipe(v.string('Please enter a note.'), v.trim(), v.nonEmpty('Please enter a note.')),
});

export type CreateConsultRequestPayload = v.InferOutput<typeof CreateConsultRequestSchema>;
