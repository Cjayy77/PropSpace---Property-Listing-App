import api from './axiosInstance';

export const getWatchlist    = ()           => api.get('/favorites');
export const getFavoriteIds  = ()           => api.get('/favorites/ids');
export const toggleFavorite  = (propertyId) => api.post(`/favorites/${propertyId}`);
