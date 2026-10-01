import axios from 'axios';

const API_ORIGIN = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BACKEND_ORIGIN = API_ORIGIN.replace(/\/api\/?$/, '');
export const FALLBACK_BOOK_IMAGE = 'https://placehold.co/300x400?text=No+Cover';

export const getBookImageUrl = (book) => {
  const image = String(book?.image || book?.coverImage || '').trim();
  if (!image) return FALLBACK_BOOK_IMAGE;
  if (/^(https?:|data:|blob:)/i.test(image)) return image;
  const normalizedImage = image.replace(/\\/g, '/');
  const imagePath = normalizedImage.startsWith('/uploads/')
    ? normalizedImage
    : normalizedImage.startsWith('uploads/')
      ? `/${normalizedImage}`
      : `/uploads/${normalizedImage.replace(/^\/+/, '')}`;
  return `${BACKEND_ORIGIN}${imagePath}`;
};

const api = axios.create({
  baseURL: API_ORIGIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export const loginApi = (data) => api.post('/auth/login', data);
export const registerApi = (data) => api.post('/auth/register', data);
export const getProfileApi = () => api.get('/auth/profile');
export const updateProfileApi = (data) => api.put('/auth/profile', data);
export const getAllUsersApi = () => api.get('/auth/users');
export const deleteUserApi = (id) => api.delete(`/auth/users/${id}`);

export const getBooksApi = (params) => api.get('/books', { params });
export const getBookByIdApi = (id) => api.get(`/books/${id}`);
export const addBookReviewApi = (id, data) => api.post(`/books/${id}/reviews`, data);
export const createBookApi = (formData) =>
  api.post('/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateBookApi = (id, formData) =>
  api.put(`/books/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteBookApi = (id) => api.delete(`/books/${id}`);
export const getCategoriesApi = () =>
  api.get('/books').then((res) => ({
    ...res,
    data: { categories: res.data.categories || [] },
  }));

export const getCartApi = () => api.get('/cart');
export const addToCartApi = (data) => api.post('/cart', data);
export const updateCartItemApi = (id, data) => api.put(`/cart/${id}`, data);
export const removeCartItemApi = (id) => api.delete(`/cart/${id}`);
export const clearCartApi = () => api.delete('/cart');

export const getOrdersApi = () => api.get('/orders/my-orders');
export const cancelOrderApi = (id) => api.put(`/orders/${id}/status`, { status: 'Cancelled' });
export const updateOrderApi = (id, data) => api.put(`/orders/${id}/status`, data);
export const createOrderApi = (data) => api.post('/orders', data);
export const getDashboardStatsApi = async () => {
  const [booksRes, ordersRes, usersRes] = await Promise.all([
    api.get('/books', { params: { limit: 1000 } }),
    api.get('/orders'),
    api.get('/auth/users'),
  ]);

  const orders = ordersRes.data || [];
  const users = usersRes.data || [];
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const ordersByStatus = Object.entries(
    orders.reduce((acc, order) => {
      const status = order.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ _id: status, count }));

  return {
    data: {
      stats: {
        totalBooks: booksRes.data.length || 0,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue,
        ordersByStatus,
        recentOrders: orders.slice(0, 5),
      },
    },
  };
};
