import { logout } from '@/utils/helpers';

const BASE_URL = import.meta.env.VITE_API_GATEWAY;

export async function fetchClinics(): Promise<any> {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/api/clinic/query`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    logout();
    return;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch clinics: ${response.statusText}`);
  }

  return response.json();
}
