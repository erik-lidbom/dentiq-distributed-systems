const BASE_URL = 'http://localhost:3000/api/booking/query';

export async function fetchAppointments(): Promise<any> {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch appointments: ${response.statusText}`);
  }

  return response.json();
}
