const LOGIN_URL = import.meta.env.VITE_LOGIN;

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = LOGIN_URL;
};
