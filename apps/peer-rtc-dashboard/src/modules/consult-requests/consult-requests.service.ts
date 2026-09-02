import * as v from 'valibot';

import { env } from '#/env';

import type {
  ConsultRequest,
  ConsultRequestListParams,
  ConsultRequestListResult,
  UpdateConsultRequestPayload,
} from './consult-requests.types';

const UserSchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.string(),
  image: v.nullable(v.string()),
});

const ConsultRequestSchema = v.object({
  id: v.string(),
  requestId: v.string(),
  consumerId: v.string(),
  consumer: UserSchema,
  providerId: v.nullable(v.string()),
  provider: v.nullable(UserSchema),
  status: v.pipe(v.string(), v.minLength(1)),
  note: v.nullable(v.string()),
  createdAt: v.string(),
  acceptedAt: v.nullable(v.string()),
  closedAt: v.nullable(v.string()),
});

const ConsultRequestListResponseSchema = v.pipe(
  v.union([
    v.object({
      data: v.array(ConsultRequestSchema),
      total: v.number(),
      page: v.optional(v.number()),
      limit: v.optional(v.number()),
      pageSize: v.optional(v.number()),
    }),
    v.object({
      items: v.array(ConsultRequestSchema),
      total: v.number(),
      page: v.optional(v.number()),
      limit: v.optional(v.number()),
      pageSize: v.optional(v.number()),
    }),
  ]),
  v.transform((value): ConsultRequestListResult => {
    const data = 'data' in value ? value.data : value.items;
    const limit = value.limit ?? value.pageSize;

    return {
      data,
      total: value.total,
      page: value.page ?? 0,
      limit: limit ?? 0,
    };
  }),
);

export async function listConsultRequests(params: ConsultRequestListParams): Promise<ConsultRequestListResult> {
  const url = new URL('/api/consult-requests', env.VITE_PUBLIC_AUTH_URL);
  url.searchParams.set('page', String(params.page));
  url.searchParams.set('limit', String(params.limit));
  url.searchParams.set('time', params.time);

  if (params.status) {
    url.searchParams.set('status', params.status);
  }

  if (params.requestId) {
    url.searchParams.set('requestId', params.requestId);
  }

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to load consult requests (${response.status})`);
  }

  const result = v.parse(ConsultRequestListResponseSchema, await response.json());

  return {
    data: result.data,
    total: result.total,
    page: result.page || params.page,
    limit: result.limit || params.limit,
  };
}

const ConsultRequestResponseSchema = v.pipe(
  v.union([ConsultRequestSchema, v.object({ data: ConsultRequestSchema })]),
  v.transform((value): ConsultRequest => ('data' in value ? value.data : value)),
);

export async function getConsultRequest(requestId: string): Promise<ConsultRequest> {
  const url = new URL(`/api/consult-requests/${requestId}`, env.VITE_PUBLIC_AUTH_URL);
  const response = await fetch(url, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`Failed to load consult request (${response.status})`);
  }
  return v.parse(ConsultRequestResponseSchema, await response.json());
}

export async function updateConsultRequest(payload: UpdateConsultRequestPayload): Promise<ConsultRequest> {
  const url = new URL(`/api/consult-requests/${payload.id}`, env.VITE_PUBLIC_AUTH_URL);
  const response = await fetch(url, {
    credentials: 'include',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to update consult request (${response.status})`);
  }
  return v.parse(ConsultRequestResponseSchema, await response.json());
}
