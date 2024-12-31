const BASE_URL = 'http://localhost:3000/api/dentist/query';

export async function fetchDentists(): Promise<any> {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch clinics: ${response.statusText}`);
  }

  return response.json();
}
