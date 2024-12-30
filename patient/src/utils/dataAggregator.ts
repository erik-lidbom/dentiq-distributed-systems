/**
 * Types for the data used in the aggregation
 */
interface Availability {
  date: string;
  times: string[];
}

interface Dentist {
  _id: string;
  name: string;
  speciality: string;
  languages: string[];
  availability?: Availability[];
  image?: string;
  clinic: string; // Clinic ID
}

interface Clinic {
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

interface Appointment {
  _id: string;
  patientId: string | null;
  dentistId: string;
  date: string;
  start_time: string;
  reason_for_visit?: string;
  status: 'unbooked' | 'booked' | 'cancelled';
}

interface AggregatedDentist extends Dentist {
  appointments: Appointment[];
}

interface AggregatedClinic extends Clinic {
  dentists: AggregatedDentist[];
}

/**
 * Aggregate clinic data with dentists and appointments.
 * @param {Clinic[]} clinics - List of clinics.
 * @param {Dentist[]} dentists - List of dentists.
 * @param {Appointment[]} appointments - List of appointments.
 * @returns {AggregatedClinic[]} - List of clinics with associated dentists and appointments.
 */
export const aggregateClinicData = (
  clinics: Clinic[],
  dentists: Dentist[],
  appointments: Appointment[]
): AggregatedClinic[] => {
  // Validate inputs
  if (
    !Array.isArray(clinics) ||
    !Array.isArray(dentists) ||
    !Array.isArray(appointments)
  ) {
    console.error('Invalid input data:', { clinics, dentists, appointments });
    return [];
  }

  // Match clinics with their respective dentists
  const dentistsByClinic: Record<string, Dentist[]> = dentists.reduce(
    (map, dentist) => {
      if (!map[dentist.clinic]) {
        map[dentist.clinic] = [];
      }
      map[dentist.clinic].push(dentist);
      return map;
    },
    {} as Record<string, Dentist[]>
  );

  // Group unbooked appointments by dentist ID and by date
  const appointmentsByDentist: Record<
    string,
    Record<string, string[]>
  > = appointments.reduce(
    (map, appointment) => {
      if (appointment.status !== 'unbooked') return map; // Only include unbooked appointments

      if (!map[appointment.dentistId]) {
        map[appointment.dentistId] = {};
      }
      const appointmentDate = appointment.date;
      if (!map[appointment.dentistId][appointmentDate]) {
        map[appointment.dentistId][appointmentDate] = [];
      }
      map[appointment.dentistId][appointmentDate].push(appointment.start_time);
      return map;
    },
    {} as Record<string, Record<string, string[]>>
  );

  // Map clinics with their respective dentists and grouped appointments
  const aggregatedClinics = clinics.map((clinic) => {
    const clinicDentists = dentistsByClinic[clinic._id] || [];
    const enrichedDentists = clinicDentists.map((dentist) => {
      const dentistAppointments = appointmentsByDentist[dentist._id] || {};

      // Convert grouped appointments into `Availability` objects
      const availability: Availability[] = Object.entries(
        dentistAppointments
      ).map(([date, times]) => ({
        date,
        times,
      }));

      return {
        ...dentist,
        availability,
      };
    });

    return {
      ...clinic,
      dentists: enrichedDentists,
    };
  });

  return aggregatedClinics;
};
