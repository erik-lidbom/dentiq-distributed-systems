import { logout } from '@/utils/helpers';

//TODO --> Change all of these to env variables
const BASE_URL = import.meta.env.VITE_API_GATEWAY;
const QUERY_URL = `${BASE_URL}/booking/query`;
const BOOK_URL = `${BASE_URL}/booking/book`;
const CANCEL_URL = `${BASE_URL}/booking/cancel`;

export async function fetchAppointments(body = {}): Promise<any> {
  const token = localStorage.getItem('token');
  const response = await fetch(QUERY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    logout();
    return;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch appointments: ${response.statusText}`);
  }

  return response.json();
}

export async function bookAppointment(body: any): Promise<any> {
  const token = localStorage.getItem('token');

  try {
    // Post an appointment
    const response = await fetch(BOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      throw new Error(`Error posting appointment: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting appointment:', error);
    throw error;
  }
}

export const cancelBooking = async (appointmentId: string): Promise<any> => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(CANCEL_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appointmentId }),
    });

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      throw new Error(`Error cancelling booking: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};
