const BASE_URL = import.meta.env.VITE_API_GATEWAY;

export async function fetchAppointments(
  dentistId: string,
  date?: string
): Promise<any> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/booking/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ dentistId, date }),
  });
  console.log('RESPONSE IS: ', response);
  if (!response.ok) {
    throw new Error(`Failed to fetch appointments: ${response.statusText}`);
  }

  return response.json();
}

export async function postAppointments(body: any): Promise<any> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/booking/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to create appointment(s): ${response.statusText}`);
  }

  return response.json();
}

export async function deleteAppointment(id: string): Promise<any> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/booking/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appointmentId: id }),
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

export const cancelAppointment = async (
  appointmentId: string
): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/booking/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ appointmentId: appointmentId }),
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
