import {
  CONSULT_REQUEST_STATUSES,
  CONSULT_REQUEST_TIME_RANGES,
  DEFAULT_CONSULT_REQUEST_LIMIT,
  DEFAULT_CONSULT_REQUEST_PAGE,
  DEFAULT_CONSULT_REQUEST_STATUS,
  DEFAULT_CONSULT_REQUEST_TIME,
  MAX_CONSULT_REQUEST_LIMIT,
  type ConsultRequestsSearch,
  type ConsultRequestStatus,
  type ConsultRequestTimeRange,
} from './consult-requests.types';

const parsePositiveInt = (value: unknown, fallback: number, max?: number) => {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN;

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  if (max !== undefined && parsed > max) {
    return max;
  }

  return parsed;
};

const parseStatus = (value: unknown): ConsultRequestStatus => {
  if (typeof value === 'string' && (CONSULT_REQUEST_STATUSES as readonly string[]).includes(value)) {
    return value as ConsultRequestStatus;
  }

  return DEFAULT_CONSULT_REQUEST_STATUS;
};

const parseTime = (value: unknown): ConsultRequestTimeRange => {
  if (typeof value === 'string' && (CONSULT_REQUEST_TIME_RANGES as readonly string[]).includes(value)) {
    return value as ConsultRequestTimeRange;
  }

  return DEFAULT_CONSULT_REQUEST_TIME;
};

const parseOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const parseConsultRequestsSearch = (search: Record<string, unknown>): ConsultRequestsSearch => ({
  page: parsePositiveInt(search.page, DEFAULT_CONSULT_REQUEST_PAGE),
  limit: parsePositiveInt(search.limit, DEFAULT_CONSULT_REQUEST_LIMIT, MAX_CONSULT_REQUEST_LIMIT),
  status: parseStatus(search.status),
  time: parseTime(search.time),
  requestId: parseOptionalString(search.requestId),
});
