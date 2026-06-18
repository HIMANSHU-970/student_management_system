import axios from "axios";

const API = "http://localhost:5002/api/auth";

export const signupUser = (data) =>
  axios.post(`${API}/signup`, data);

export const loginUser = (data) =>
  axios.post(`${API}/login`, data);