//TODO --> Change to env variables
const LOGIN_URL = `http://localhost:5173/login`;

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = LOGIN_URL;
};
