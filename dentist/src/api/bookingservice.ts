const QUERY_URL = 'http://localhost:3000/api/booking/query';
const POST_URL = 'http://localhost:3000/api/booking/create';
const DELETE_URL = 'http://localhost:3000/api/booking/delete';

export async function fetchAppointments(dentistId: string, date?: string): Promise<any> {
  const response = await fetch(QUERY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dentistId, date })
  });
  console.log("RESPONSE IS: ", response)
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

export async function deleteAppointment(appointmentId: string): Promise<any> {
    try {
      const response = await fetch(DELETE_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId })
      });

      if (!response.ok) {
        throw new Error(`Error deleting booked slot: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Booking cancelled successfully:', data);
      return data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
}