import { logout } from '@/utils/helpers';

const BASE_URL = 'http://localhost:4000/api/clinic/query';

export async function fetchClinics(): Promise<any> {
  const token = localStorage.getItem('token');

  const response = await fetch(BASE_URL, {
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
