'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { Context7BootstrapPayload, Context7UserPayload } from '@/lib/context7';

interface Context7ContextValue {
  enabled: boolean;
  bootstrap: Context7BootstrapPayload;
  trackEvent: (name: string, data?: Record<string, unknown>) => Promise<void> | void;
  identifyUser: (user: Partial<Context7UserPayload>) => Promise<void> | void;
  getFeatureFlag: (flag: string) => boolean;
  getExperimentVariant: (experiment: string) => string | undefined;
}

const noop = async () => undefined;

const Context7Context = createContext<Context7ContextValue>({
  enabled: false,
  bootstrap: {
    enabled: false,
    sessionId: '',
    visitorId: '',
    featureFlags: {},
    experiments: {}
  },
  trackEvent: noop,
  identifyUser: noop,
  getFeatureFlag: () => false,
  getExperimentVariant: () => undefined
});

function getWindowSnapshot() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return {
    language: window.navigator?.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: {
      width: window.screen?.width,
      height: window.screen?.height,
      density: window.devicePixelRatio
    }
  };
}

function serializeSearchParams(searchParams: ReturnType<typeof useSearchParams>) {
  if (!searchParams) return '';
  const entries = Array.from(searchParams.entries());
  if (!entries.length) return '';
  const usp = new URLSearchParams(entries);
  return `?${usp.toString()}`;
}

export function Context7Provider({
  children,
  bootstrap
}: {
  children: React.ReactNode;
  bootstrap: Context7BootstrapPayload;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = serializeSearchParams(searchParams);
  const lastTrackedPath = useRef<string>('');

  const postJSON = useCallback(
    async (url: string, body: Record<string, unknown>) => {
      if (!bootstrap.enabled) return;
      try {
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[Context7] failed to transmit event', error);
        }
      }
    },
    [bootstrap.enabled]
  );

  const trackEvent = useCallback<Context7ContextValue['trackEvent']>(
    async (name, data) => {
      await postJSON('/api/context7/events', {
        ...data,
        name,
        sessionId: bootstrap.sessionId,
        visitorId: bootstrap.visitorId,
        type: 'event'
      });
    },
    [bootstrap.sessionId, bootstrap.visitorId, postJSON]
  );

  const identifyUser = useCallback<Context7ContextValue['identifyUser']>(
    async (user) => {
      if (!user?.id) return;
      await postJSON('/api/context7/identify', {
        user,
        sessionId: bootstrap.sessionId,
        visitorId: bootstrap.visitorId
      });
    },
    [bootstrap.sessionId, bootstrap.visitorId, postJSON]
  );

  useEffect(() => {
    if (!bootstrap.enabled) return;
    if (bootstrap.user?.id) {
      identifyUser(bootstrap.user);
    }
  }, [bootstrap.enabled, bootstrap.user, identifyUser]);

  useEffect(() => {
    if (!bootstrap.enabled) return;
    const path = `${pathname}${searchString}`;
    if (lastTrackedPath.current === path) return;
    lastTrackedPath.current = path;

    const snapshot = getWindowSnapshot();
    const referrer = typeof document !== 'undefined' ? document.referrer || null : null;

    postJSON('/api/context7/events', {
      sessionId: bootstrap.sessionId,
      visitorId: bootstrap.visitorId,
      type: 'page_view',
      name: 'route_change',
      path,
      referrer,
      source: searchParams?.get('utm_source') ?? null,
      device: snapshot,
      data: {
        title: typeof document !== 'undefined' ? document.title : undefined
      }
    });
  }, [
    bootstrap.enabled,
    bootstrap.sessionId,
    bootstrap.visitorId,
    pathname,
    postJSON,
    searchParams,
    searchString
  ]);

  const value = useMemo<Context7ContextValue>(
    () => ({
      enabled: bootstrap.enabled,
      bootstrap,
      trackEvent,
      identifyUser,
      getFeatureFlag: (flag) => Boolean(bootstrap.featureFlags?.[flag]),
      getExperimentVariant: (experiment) => bootstrap.experiments?.[experiment]
    }),
    [bootstrap, trackEvent, identifyUser]
  );

  return <Context7Context.Provider value={value}>{children}</Context7Context.Provider>;
}

export function useContext7() {
  return useContext(Context7Context);
}

export function Context7PageTracker({
  page,
  data
}: {
  page: string;
  data?: Record<string, unknown>;
}) {
  const { trackEvent, enabled } = useContext7();

  useEffect(() => {
    if (!enabled) return;
    trackEvent('page_section_view', {
      type: 'page_section',
      page,
      data
    });
  }, [enabled, trackEvent, page, data]);

  return null;
}


