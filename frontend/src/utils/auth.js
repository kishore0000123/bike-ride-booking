export const setAuthData = ({ token, role }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
};

export const setUserData = ({ name, email, userId }) => {
  if (name) localStorage.setItem("userName", name);
  if (email) localStorage.setItem("userEmail", email);
  if (userId) localStorage.setItem("userId", userId);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUserRole = () => {
  return localStorage.getItem("role");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};
