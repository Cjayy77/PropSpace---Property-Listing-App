import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFavoriteIds, toggleFavorite } from '../api/favorites';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext({ ids: new Set(), toggle: () => {} });

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState(new Set());

  useEffect(() => {
    if (!user) { setIds(new Set()); return; }
    getFavoriteIds()
      .then((res) => setIds(new Set(res.data.ids)))
      .catch(() => {});
  }, [user]);

  const toggle = useCallback(async (propertyId) => {
    if (!user) return;
    try {
      const res = await toggleFavorite(propertyId);
      setIds((prev) => {
        const next = new Set(prev);
        res.data.favorited ? next.add(propertyId) : next.delete(propertyId);
        return next;
      });
      return res.data.favorited;
    } catch {
      return null;
    }
  }, [user]);

  return (
    <FavoritesContext.Provider value={{ ids, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
