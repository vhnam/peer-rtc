import { getRouteApi } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@peer-rtc/ui/components/button';
import { Field, FieldLabel } from '@peer-rtc/ui/components/field';
import { Input } from '@peer-rtc/ui/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@peer-rtc/ui/components/select';

import { CONSULT_REQUEST_STATUS_OPTIONS, DATE_RANGE_OPTIONS } from '#/constants/consult-request.constants';

import {
  CONSULT_REQUEST_STATUSES,
  CONSULT_REQUEST_TIME_RANGES,
  DEFAULT_CONSULT_REQUEST_PAGE,
  DEFAULT_CONSULT_REQUEST_STATUS,
  DEFAULT_CONSULT_REQUEST_TIME,
  type ConsultRequestStatus,
  type ConsultRequestTimeRange,
  type ConsultRequestsSearch,
} from './consult-requests.types';

const consultRequestsRoute = getRouteApi('/_protected/consult-requests/');

const REQUEST_ID_DEBOUNCE_MS = 400;

type ConsultRequestsFilterProps = {
  status: ConsultRequestStatus;
  time: ConsultRequestTimeRange;
  requestId?: string;
};

export const ConsultRequestsFilter = ({ status, time, requestId }: ConsultRequestsFilterProps) => {
  const navigate = consultRequestsRoute.useNavigate();
  const [requestIdInput, setRequestIdInput] = useState(requestId ?? '');

  useEffect(() => {
    setRequestIdInput(requestId ?? '');
  }, [requestId]);

  const updateSearch = useCallback(
    (next: Partial<Pick<ConsultRequestsSearch, 'status' | 'time' | 'requestId'>>, replace = false) => {
      void navigate({
        replace,
        to: '.',
        search: (previous) => {
          const nextSearch = {
            ...previous,
            ...next,
            page: DEFAULT_CONSULT_REQUEST_PAGE,
          };

          if (!nextSearch.requestId) {
            delete nextSearch.requestId;
          }

          return nextSearch;
        },
      });
    },
    [navigate],
  );

  useEffect(() => {
    const nextRequestId = requestIdInput.trim() || undefined;

    if (nextRequestId === requestId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      updateSearch({ requestId: nextRequestId }, true);
    }, REQUEST_ID_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [requestId, requestIdInput, updateSearch]);

  const isDefault =
    status === DEFAULT_CONSULT_REQUEST_STATUS && time === DEFAULT_CONSULT_REQUEST_TIME && !requestId && !requestIdInput;

  return (
    <div className="flex gap-2 justify-between items-end mb-2">
      <div className="flex gap-2">
        <Field className="max-w-64">
          <FieldLabel>Request ID</FieldLabel>
          <Input
            value={requestIdInput}
            placeholder="Enter request ID"
            onChange={(event) => {
              setRequestIdInput(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                updateSearch({ requestId: requestIdInput.trim() || undefined });
              }
            }}
          />
        </Field>

        <Field className="max-w-36">
          <FieldLabel>Status</FieldLabel>
          <Select
            items={CONSULT_REQUEST_STATUS_OPTIONS}
            value={status}
            onValueChange={(value) => {
              if (typeof value === 'string' && (CONSULT_REQUEST_STATUSES as readonly string[]).includes(value)) {
                updateSearch({ status: value });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {CONSULT_REQUEST_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field className="max-w-48">
          <FieldLabel>Time</FieldLabel>
          <Select
            items={DATE_RANGE_OPTIONS}
            value={time}
            onValueChange={(value) => {
              if (typeof value === 'string' && (CONSULT_REQUEST_TIME_RANGES as readonly string[]).includes(value)) {
                updateSearch({ time: value as ConsultRequestTimeRange });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Button
        variant="outline"
        disabled={isDefault}
        onClick={() => {
          setRequestIdInput('');
          updateSearch({
            status: DEFAULT_CONSULT_REQUEST_STATUS,
            time: DEFAULT_CONSULT_REQUEST_TIME,
            requestId: undefined,
          });
        }}
      >
        Reset
      </Button>
    </div>
  );
};
