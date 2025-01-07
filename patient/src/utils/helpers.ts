//TODO --> Change to env variables
const LOGIN_URL = `http://localhost:5173/login`;

export const logout = () => {
  window.location.href = LOGIN_URL;
};
