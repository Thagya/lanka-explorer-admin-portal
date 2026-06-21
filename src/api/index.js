import api from './client.js'

// Auth
export const adminLogin    = (data) => api.post('/auth/login', data)
export const getMe         = ()     => api.get('/auth/me')

// Bookings
export const getAllBookings = (params) => api.get('/bookings', { params })
export const getBooking    = (id)     => api.get(`/bookings/${id}`)
export const transitionBooking = (id, data) => api.patch(`/bookings/${id}`, data)
export const deleteBooking = (id)     => api.delete(`/bookings/${id}`)

// Listings
export const getAllListings   = () => api.get('/listings/all')
export const getListing       = (id) => api.get(`/listings/${id}`)
export const createListing    = (data) => api.post('/listings', data)
export const updateListing    = (id, data) => api.put(`/listings/${id}`, data)
export const deleteListing    = (id) => api.delete(`/listings/${id}`)

// Attractions
export const getAttractions   = (params) => api.get('/attractions', { params })
export const getAttraction    = (id) => api.get(`/attractions/${id}`)
export const createAttraction = (data) => api.post('/attractions', data)
export const updateAttraction = (id, data) => api.put(`/attractions/${id}`, data)
export const deleteAttraction = (id) => api.delete(`/attractions/${id}`)

// Users
export const getUsers         = () => api.get('/users')
export const getUser          = (id) => api.get(`/users/${id}`)
export const toggleUser       = (id) => api.patch(`/users/${id}/toggle`)
export const deleteUser       = (id) => api.delete(`/users/${id}`)
