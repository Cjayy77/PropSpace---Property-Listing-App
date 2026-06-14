import api from './axiosInstance';

export const getAllProperties = (params) => api.get('/properties', { params });
export const getPropertyById = (id) => api.get(`/properties/${id}`);
export const getMyProperties = () => api.get('/properties/mine');
export const createProperty = (data) => api.post('/properties', data);
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data);
export const deleteProperty = (id) => api.delete(`/properties/${id}`);
