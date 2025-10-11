import axios from "axios";
import { getTokenFromStorage } from "../services/storageService";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Ensures existing token is sent along with requests other than /login and /register
// But currently this doesn't matter because my POST and DELETE requests for artists,
// artworks, and categories don't use axios and I'm manually including the header instead.
apiClient.interceptors.request.use(
  (config) => {
    if (!config.url?.includes("/login") && !config.url?.includes("/register")) {
      const token = getTokenFromStorage();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
