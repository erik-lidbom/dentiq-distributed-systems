export interface Availability {
  date: string;
  times: string[];
}

export interface Dentist {
  _id: string;
  name: string;
  speciality: string;
  languages: string[];
  availability?: Availability[];
  image?: string;
  clinic: string; // Clinic ID
  id: string;
}

export interface Clinic {
  _id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  services: string[];
  firstAvailableTime: string;
  languages: string[];
}

export interface Appointment {
  _id: string;
  patientId: string | null;
  dentistId: string;
  date: string;
  start_time: string;
  reason_for_visit?: string;
  status: 'unbooked' | 'booked' | 'cancelled';
  dentist: Dentist;
}

export interface AggregatedDentist extends Dentist {
  appointments: Appointment[];
}

export interface AggregatedClinic extends Clinic {
  dentists: AggregatedDentist[];
}
