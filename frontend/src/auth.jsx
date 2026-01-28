export const login = (username, password) => {
  if (username === "admin" && password === "admin123") {
    sessionStorage.setItem("isAuthenticated", "true");
    return true;
  }
  return false;
};

export const logout = () => {
  sessionStorage.removeItem("isAuthenticated");
};

export const isAuthenticated = () => {
  return sessionStorage.getItem("isAuthenticated") === "true";
};
