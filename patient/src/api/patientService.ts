import { logout } from '@/utils/helpers';

const BASE_URL = import.meta.env.VITE_API_GATEWAY;

export async function fetchPatient(): Promise<any> {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // TODO --> Change to GET METHOD
  const response = await fetch(`${BASE_URL}/auth/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ patientId: userId }),
  });

  if (response.status === 401) {
    logout();
    return;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch patient: ${response.statusText}`);
  }

  // Await and return the JSON response properly
  const responseData = await response.json();
  return responseData;
}
