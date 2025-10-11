import apiClient from "../config/api-client";

// These functions handle making the requests for each endpoint for auth using axios
// They each return an HTTP response object

export const requestRegistration = (userProfile) => {
  return apiClient.post("/user/register", userProfile);
};

export const requestLogin = (authRequest) => {
  return apiClient.post("/user/login", authRequest);
};

export const requestLogout = () => {
  return apiClient.post("/user/logout");
};

export const validateToken = (validationRequest) => {
  return apiClient.post("/user/validate-token", validationRequest);
};
