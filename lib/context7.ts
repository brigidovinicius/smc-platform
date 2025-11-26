import type { NextRequest } from 'next/server';

const DEFAULT_BASE_URL = process.env.CONTEXT7_BASE_URL ?? 'https://api.context7.com';
const API_KEY = process.env.CONTEXT7_API_KEY ?? '';
const PROJECT_ID = process.env.CONTEXT7_PROJECT_ID ?? '';
const CLIENT_TOKEN = process.env.CONTEXT7_CLIENT_TOKEN ?? '';
const PUBLIC_CLIENT_TOKEN =
  process.env.NEXT_PUBLIC_CONTEXT7_CLIENT_TOKEN ?? process.env.CONTEXT7_CLIENT_TOKEN ?? '';
const PUBLIC_PROJECT_ID =
  process.env.NEXT_PUBLIC_CONTEXT7_PROJECT_ID ?? process.env.CONTEXT7_PROJECT_ID ?? '';
const DEBUG_MODE = (process.env.CONTEXT7_DEBUG ?? '').toLowerCase() === 'true';

export interface Context7UserPayload {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string | null;
}

export interface Context7BootstrapPayload {
  enabled: boolean;
  sessionId: string;
  visitorId: string;
  clientToken?: string;
  projectId?: string;
  user?: Context7UserPayload | null;
  featureFlags: Record<string, boolean>;
  experiments: Record<string, string>;
  score?: number;
  snippet?: string;
}

export interface Context7EventPayload {
  sessionId: string;
  visitorId: string;
  type: string;
  name?: string;
  path?: string;
  source?: string | null;
  referrer?: string | null;
  data?: Record<string, unknown>;
  user?: Context7UserPayload | null;
  device?: Context7DeviceSnapshot;
  experiment?: string;
}

export interface Context7DeviceSnapshot {
  userAgent?: string;
  locale?: string;
  platform?: string;
  screen?: {
    width?: number;
    height?: number;
    density?: number;
  };
}

export interface Context7ServerResult<T = unknown> {
  ok: boolean;
  status?: number;
  data?: T;
  error?: string;
  disabled?: boolean;
}

interface Context7Config {
  baseUrl: string;
  apiKey: string;
  projectId?: string;
  clientToken?: string;
  debug?: boolean;
}

const context7Config: Context7Config = {
  baseUrl: DEFAULT_BASE_URL,
  apiKey: API_KEY,
  projectId: PROJECT_ID || undefined,
  clientToken: CLIENT_TOKEN || undefined,
  debug: DEBUG_MODE
};

export const isContext7Enabled = Boolean(context7Config.apiKey && context7Config.projectId);

export class Context7ServerClient {
  constructor(private readonly cfg: Context7Config) {}

  private async request<T>(path: string, body: unknown): Promise<Context7ServerResult<T>> {
    if (!isContext7Enabled) {
      return { ok: false, disabled: true };
    }

    try {
      const response = await fetch(`${this.cfg.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-context7-api-key': this.cfg.apiKey,
          'x-context7-project-id': this.cfg.projectId ?? ''
        },
        body: JSON.stringify(body)
      });

      const data = (await response.json().catch(() => null)) as T | null;
      return { ok: response.ok, status: response.status, data: data ?? undefined };
    } catch (error) {
      if (this.cfg.debug) {
        console.error('[Context7] request failed', error);
      }
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown Context7 error'
      };
    }
  }

  identify(payload: Record<string, unknown>) {
    return this.request('/identify', payload);
  }

  trackEvent(payload: Context7EventPayload) {
    return this.request('/events', payload);
  }

  trackPageView(payload: Context7EventPayload) {
    return this.request('/pageviews', payload);
  }

  logAction(payload: Record<string, unknown>) {
    return this.request('/actions', payload);
  }

  logLead(payload: Record<string, unknown>) {
    return this.request('/leads', payload);
  }

  logMutation(payload: Record<string, unknown>) {
    return this.request('/mutations', payload);
  }

  health() {
    return this.request('/health', { timestamp: Date.now() });
  }
}

export const context7ServerClient = new Context7ServerClient(context7Config);

export function buildDeviceSnapshotFromRequest(req: NextRequest): Context7DeviceSnapshot {
  const userAgent = req.headers.get('user-agent') ?? undefined;
  const locale = req.headers.get('accept-language')?.split(',')[0];
  const deviceHeader = req.headers.get('sec-ch-ua-platform');

  return {
    userAgent,
    locale,
    platform: deviceHeader?.replace(/"/g, '') ?? undefined
  };
}

export function generateSessionId(seed?: string) {
  if (seed) {
    return seed;
  }
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export const CONTEXT7_SESSION_COOKIE = 'ctx7_session_id';
export const CONTEXT7_VISITOR_COOKIE = 'ctx7_visitor_id';

export function buildFeatureFlags(seed: string) {
  const hash = djb2(seed);
  return {
    telemetryEnabled: true,
    abTesting: true,
    betaNavbar: hash % 3 === 0,
    highlightValuationCalculator: hash % 5 === 0,
    enableLeadScoring: hash % 2 === 0
  };
}

export function buildExperiments(seed: string) {
  const hash = djb2(seed);
  return {
    heroExperiment: hash % 2 === 0 ? 'variant-a' : 'control',
    pricingExperiment: hash % 3 === 0 ? 'variant-b' : 'control'
  };
}

export function scoreUser(user?: Context7UserPayload | null) {
  if (!user?.id) return 12;
  let score = 35;
  if (user.email?.endsWith('@counterx.com')) {
    score += 25;
  }
  if (user.role === 'admin') {
    score += 20;
  }
  if ((user.name ?? '').split(' ').length > 1) {
    score += 5;
  }
  return Math.min(score, 95);
}

export function buildSnippet(params: { sessionId: string; clientToken?: string; projectId?: string }) {
  if (!params.clientToken || !params.projectId) {
    return undefined;
  }

  const snippetPayload = {
    sessionId: params.sessionId,
    clientToken: params.clientToken,
    projectId: params.projectId
  };

  return `(function(){if(window.__context7){return;}window.__context7=window.__context7||{queue:[],cfg:${JSON.stringify(
    snippetPayload
  )},push:function(evt){this.queue.push(evt);}};window.context7=window.__context7;})();`;
}

export function createBootstrapPayload(options: {
  sessionId: string;
  visitorId: string;
  user?: Context7UserPayload | null;
  referrer?: string | null;
  source?: string | null;
}): Context7BootstrapPayload {
  return {
    enabled: isContext7Enabled,
    sessionId: options.sessionId,
    visitorId: options.visitorId,
    clientToken: PUBLIC_CLIENT_TOKEN || context7Config.clientToken,
    projectId: PUBLIC_PROJECT_ID || context7Config.projectId,
    user: options.user ?? null,
    featureFlags: buildFeatureFlags(options.visitorId),
    experiments: buildExperiments(options.visitorId),
    score: scoreUser(options.user),
    snippet: buildSnippet({
      sessionId: options.sessionId,
      clientToken: PUBLIC_CLIENT_TOKEN || context7Config.clientToken,
      projectId: PUBLIC_PROJECT_ID || context7Config.projectId
    })
  };
}

export function parseSourceFromUrl(url?: string | null) {
  if (!url) return null;
  try {
    const target = new URL(url);
    const params = target.searchParams;
    return (
      params.get('utm_source') ||
      params.get('ref') ||
      params.get('source') ||
      target.hostname.replace(/^www\./, '')
    );
  } catch {
    return null;
  }
}

export function buildEventFromRequest(req: NextRequest, overrides?: Partial<Context7EventPayload>): Context7EventPayload {
  const sessionId = overrides?.sessionId ?? generateSessionId(req.cookies.get(CONTEXT7_SESSION_COOKIE)?.value);
  const visitorId = overrides?.visitorId ?? generateSessionId(req.cookies.get(CONTEXT7_VISITOR_COOKIE)?.value);

  const url = new URL(req.url);
  return {
    sessionId,
    visitorId,
    type: overrides?.type ?? 'page_view',
    name: overrides?.name ?? 'edge_middleware',
    path: overrides?.path ?? `${url.pathname}${url.search}`,
    source: overrides?.source ?? parseSourceFromUrl(req.headers.get('referer')),
    referrer: overrides?.referrer ?? req.headers.get('referer'),
    device: overrides?.device ?? buildDeviceSnapshotFromRequest(req),
    data: {
      method: req.method,
      country: req.geo?.country,
      city: req.geo?.city,
      ip: req.ip
    }
  };
}

export async function captureEdgeTelemetry(req: NextRequest) {
  if (!isContext7Enabled) return;
  const event = buildEventFromRequest(req, { type: 'edge_page_view' });
  await context7ServerClient.trackPageView(event);
}

export async function recordServerAction(params: {
  action: string;
  user?: Context7UserPayload | null;
  result?: string;
  metadata?: Record<string, unknown>;
  sessionId?: string;
}) {
  if (!isContext7Enabled) return;
  await context7ServerClient.logAction({
    ...params,
    timestamp: Date.now()
  });
}

export async function recordServerMutation(params: {
  entity: string;
  operation: 'create' | 'update' | 'delete';
  user?: Context7UserPayload | null;
  metadata?: Record<string, unknown>;
}) {
  if (!isContext7Enabled) return;
  await context7ServerClient.logMutation({
    ...params,
    timestamp: Date.now()
  });
}

export async function recordLeadEvent(params: {
  leadId: string;
  assetId: string;
  email: string;
  status: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!isContext7Enabled) return;
  await context7ServerClient.logLead({
    ...params,
    timestamp: Date.now()
  });
}

export async function forwardClientEvent(event: Context7EventPayload) {
  if (!isContext7Enabled) {
    return { forwarded: false, disabled: true } as const;
  }

  const payload = {
    ...event,
    projectId: context7Config.projectId,
    clientToken: context7Config.clientToken
  };

  const response = await context7ServerClient.trackEvent(payload);
  return { forwarded: response.ok, status: response.status, error: response.error };
}

function djb2(input: string) {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}


