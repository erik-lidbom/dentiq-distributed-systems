import { jwtDecode } from 'jwt-decode';
import { Api } from './Api';

export const getLoggedInUser = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token not found');
    }

    // Decode the token to extract user information
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    if (!userId) {
      throw new Error('User ID not found in token');
    }

    // Fetch the user details using the extracted user ID, include the token in the Authorization header
    const response = await Api.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.user;
  } catch (error) {
    console.error('Error fetching logged-in user:', error.message);
    return null;
  }
};
