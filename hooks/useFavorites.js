import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useFavorites() {
  const { data: session } = useSession();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }

    fetch('/api/favorites')
      .then((res) => res.json())
      .then((data) => {
        if (data.favoriteIds) {
          setFavoriteIds(new Set(data.favoriteIds));
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('[useFavorites] Erro ao carregar favoritos:', error);
        setLoading(false);
      });
  }, [session]);

  const toggleFavorite = async (offerId) => {
    if (!session) {
      window.location.href = `/auth/login?callbackUrl=/feed`;
      return;
    }

    const isFavorite = favoriteIds.has(offerId);
    const method = isFavorite ? 'DELETE' : 'POST';

    try {
      const response = await fetch(`/api/favorites/${offerId}`, { method });
      if (response.ok) {
        const newSet = new Set(favoriteIds);
        if (isFavorite) {
          newSet.delete(offerId);
        } else {
          newSet.add(offerId);
        }
        setFavoriteIds(newSet);
      }
    } catch (error) {
      console.error('[useFavorites] Erro ao favoritar:', error);
    }
  };

  return {
    favoriteIds,
    isFavorite: (offerId) => favoriteIds.has(offerId),
    toggleFavorite,
    loading
  };
}



