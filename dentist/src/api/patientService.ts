import { logout } from '@/utils/helpers';

const BASE_URL = import.meta.env.VITE_API_GATEWAY;

export async function fetchPatient(patientId: string): Promise<any> {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/auth/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ patientId: patientId }),
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
  console.log('patient response from service:', responseData);
  return responseData;
}
