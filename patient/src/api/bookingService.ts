const QUERY_URL = 'http://localhost:3000/api/booking/query';
const BOOK_URL = 'http://localhost:3000/api/booking/book';
const CANCEL_URL = 'http://localhost:3000/api/booking/cancel';

export async function fetchAppointments(body = {}): Promise<any> {
  const response = await fetch(QUERY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
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
    const response = await fetch(BOOK_URL, {
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

export const cancelBooking = async (appointmentId: string): Promise<any> => {
  try {
    const response = await fetch(CANCEL_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appointmentId }),
    });

    if (!response.ok) {
      throw new Error(`Error cancelling booking: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Booking cancelled successfully:', data);
    return data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};
