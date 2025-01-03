const QUERY_URL = 'http://localhost:3000/api/booking/query';
const POST_URL = 'http://localhost:3000/api/booking/create';

export async function fetchAppointments(dentistId: string, date: string): Promise<any> {
  const response = await fetch(QUERY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dentistId, date })
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch appointments: ${response.statusText}`);
  }

  return response.json();
}

export async function postAppointments(body: any): Promise<any> {
    const response = await fetch(POST_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    
      if (!response.ok) {
        throw new Error(`Failed to create appointment(s): ${response.statusText}`);
      }
    
      return response.json()
}