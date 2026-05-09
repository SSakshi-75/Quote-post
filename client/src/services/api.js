import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, 
});

// Interceptor to add token to headers
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Authentication APIs
export const registerAPI = async (userData) => {
  const { data } = await API.post("/users/register", userData);
  return data;
};

export const loginAPI = async (userData) => {
  const { data } = await API.post("/users/login", userData);
  return data;
};

export const logoutAPI = async () => {
  const { data } = await API.delete("/users/logout");
  return data;
};

export const updateProfileAPI = async (profileData) => {
  const { data } = await API.patch("/users/update-profile", profileData);
  return data;
};

export const deleteUserAPI = async (id) => {
  const { data } = await API.delete(`/users/delete/${id}`);
  return data;
};

// Quote APIs
export const getQuotesAPI = async () => {
  const { data } = await API.get("/quotes");
  return data;
};

export const createQuoteAPI = async (quoteData) => {
  const { data } = await API.post("/quotes/create", quoteData);
  return data;
};

export const likeQuoteAPI = async (id) => {
  const { data } = await API.post(`/quotes/${id}/like`);
  return data;
};

export const deleteQuoteAPI = async (id) => {
  const { data } = await API.delete(`/quotes/${id}`);
  return data;
};

export const updateQuoteAPI = async (id, quoteData) => {
  const { data } = await API.put(`/quotes/${id}`, quoteData);
  return data;
};

export const getAllUsersAPI = async () => {
  const { data } = await API.get("/users/all");
  return data;
};

