const BASE_URL = 'http://localhost:3000/api/booking/query';

export async function fetchAppointments(body = {}): Promise<any> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch appointments: ${response.statusText}`);
  }

  return response.json();
}

export async function bookAppointment(body: any): Promise<any> {
  try {
    // Post an appointment
    const response = await fetch(`${BASE_URL}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error posting appointment: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Appointment posted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error posting appointment:', error);
    throw error;
  }
}
