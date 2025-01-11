import { useDentistStore } from '@/stores';

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

export async function fetchAllAppointments(): Promise<any[]> {
  try {
    const dentistId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/booking/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: dentistId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch appointments: ${response.statusText}`);
    }

    const responseData = await response.json();

    if (responseData?.data?.data) {
      return responseData.data.data; // Assuming appointments are in data.data
    } else {
      console.error('Unexpected response structure:', responseData);
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

export async function deleteAppointments(
  appointmentIds: string[]
): Promise<any> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/booking/delete-many`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(appointmentIds),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete appointments: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error deleting appointments:', error);
    throw error;
  }
}

export async function cancelAppointment(appointmentId: string): Promise<any> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/booking/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appointmentId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel appointment: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
}
