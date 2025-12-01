import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type FavoritesResponse = {
  favoriteIds?: string[];
};

type UseFavoritesReturn = {
  favoriteIds: Set<string>;
  isFavorite: (offerId: string) => boolean;
  toggleFavorite: (offerId: string) => Promise<void>;
  loading: boolean;
};

export function useFavorites(): UseFavoritesReturn {
  const { data: session } = useSession();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!session) {
      setFavoriteIds(new Set());
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const loadFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        const data = (await response.json()) as FavoritesResponse;
        if (!isMounted) return;
        setFavoriteIds(new Set(data.favoriteIds ?? []));
      } catch (error) {
        console.error('[useFavorites] Failed to load favorites:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [session]);

  const toggleFavorite = useCallback(
    async (offerId: string) => {
      if (!session) {
        window.location.href = `/auth/login?callbackUrl=/feed`;
        return;
      }

      const isFavorite = favoriteIds.has(offerId);
      const method = isFavorite ? 'DELETE' : 'POST';

      try {
        const response = await fetch(`/api/favorites/${offerId}`, { method });
        if (!response.ok) {
          return;
        }
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (isFavorite) {
            next.delete(offerId);
          } else {
            next.add(offerId);
          }
          return next;
        });
      } catch (error) {
        console.error('[useFavorites] Failed to toggle favorite:', error);
      }
    },
    [favoriteIds, session]
  );

  const isFavorite = useCallback((offerId: string) => favoriteIds.has(offerId), [favoriteIds]);

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    loading
  };
}




