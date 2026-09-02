import type { ConsultRequestStatus, ConsultRequestTimeRange } from '#/modules/consult-requests/consult-requests.types';

export type ConsultRequestStatusOption = {
  label: string;
  value: ConsultRequestStatus;
};

export type ConsultRequestTimeRangeOption = {
  label: string;
  value: ConsultRequestTimeRange;
};

export const CONSULT_REQUEST_STATUS_OPTIONS: ConsultRequestStatusOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Closed', value: 'closed' },
  { label: 'Canceled', value: 'canceled' },
];

export const DATE_RANGE_OPTIONS: ConsultRequestTimeRangeOption[] = [
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'this-week' },
  { label: 'Next week', value: 'next-week' },
  { label: 'Previous week', value: 'previous-week' },
  { label: 'This month', value: 'this-month' },
  { label: 'Next month', value: 'next-month' },
  { label: 'Previous month', value: 'previous-month' },
];
