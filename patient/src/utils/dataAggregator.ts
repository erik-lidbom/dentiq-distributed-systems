import type {
  Clinic,
  Dentist,
  Appointment,
  AggregatedClinic,
  Availability,
} from '@/types/types';

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

export const aggregatePatientAppointments = (
  appointments: Appointment[],
  dentists: Dentist[],
  clinics: Clinic[],
  patientId: string
): Availability[] => {
  // Validate inputs
  if (
    !appointments ||
    !dentists ||
    !clinics ||
    !Array.isArray(appointments) ||
    !Array.isArray(dentists) ||
    !Array.isArray(clinics)
  ) {
    console.error('Invalid input data:', { appointments, dentists, clinics });
    return [];
  }

  // Filter appointments by patient ID
  const patientAppointments = appointments.filter(
    (appointment) => appointment.patientId === patientId
  );

  // Attach dentist and clinic information to each appointment
  const appointmentsWithDentistAndClinic = patientAppointments.map(
    (appointment) => {
      const dentist = dentists.find(
        (dentist) => dentist._id === appointment.dentistId
      );
      const clinic = clinics.find((clinic) => clinic._id === dentist?.clinic);
      return {
        ...appointment,
        dentist,
        clinic,
      };
    }
  );

  console.log('Patient appointments: ', appointmentsWithDentistAndClinic);

  return appointmentsWithDentistAndClinic;
};
