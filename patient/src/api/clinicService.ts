const BASE_URL = 'http://localhost:3000/api/clinic/query';

export async function fetchClinics(): Promise<any> {
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
