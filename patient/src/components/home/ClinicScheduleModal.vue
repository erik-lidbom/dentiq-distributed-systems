<template>
  <!-- Conditional if no available doctors -->
  <div
    v-if="availableDoctors.length === 0"
    class="text-gray-500 text-center"
    :class="isMobile ? 'px-5 py-50' : 'px-10 py-20'"
  >
    <p>
      Sorry, no doctors are currently available for appointments. Please try
      again later.
    </p>
  </div>

  <div v-else 
    class="flex flex-col items-end space-y-4"
    :class="isMobile ? 'px-2 py-16' : 'p-2'"
  >
    <!-- Progress Bar -->
    <div 
      class="w-[95%] flex self-start justify-between items-center mb-4"
      aria-valuemax="4"
      aria-label="Booking progress"
      :aria-valuenow="step"
    >
      <div
        v-for="n in 4"
        :key="n"
        class="flex-1 h-2 mx-1 rounded-full"
        :class="{
          'bg-green-600': isSuccess,
          'bg-blue-500': step >= n,
          'bg-gray-300': step < n,
        }"
      ></div>
    </div>

    <!-- Step 1: Select Doctor and Language -->
    <div
      class="flex flex-row space-x-2 w-full max-h-fit"
      aria-labelledby="step1-heading"
      v-if="step === 1"
    >
      <!-- Doctors -->
      <div
        class="w-full flex flex-col justify-start h-fit max-h-[290px] overflow-y-auto space-y-2"
        aria-label="Available doctors"
        role="listbox"
      >
        <h3 id="step1-heading" class="sm:text-lg font-medium text-dentiq-muted-darkest">
          Select Doctor <span class="text-dentiq-muted-semiLight">*</span>
        </h3>
        <div class="max-h-[240px] space-y-2">
          <button
            v-for="doctor in availableDoctors"
            :key="doctor.id"
            class="flex items-start justify-between px-4 py-3 min-w-full min-h-[65px] max-h-[65px] border rounded-xl focus:ring-2 focus:ring-blue-500 hover:bg-blue-50"
            :class="{
              'border-blue-500 bg-blue-50': selectedDoctor?.id === doctor.id,
              'cursor-not-allowed text-dentiq-muted-light':
                !hasUpcomingAvailability(doctor),
            }"
            :aria-label="`Select ${doctor.name}, specialty: ${doctor.speciality}`"
            :aria-disabled="!hasUpcomingAvailability(doctor)"
            :aria-selected="selectedDoctor?.id === doctor.id"
            role="option"
            tabindex="0"
            @click="hasUpcomingAvailability(doctor) && selectDoctor(doctor)"
          >
            <div>
              <h4 class="font-medium text-sm sm:text-lg">{{ doctor.name }}</h4>
              <p class="text-xs sm:text-sm text-gray-500">{{ doctor.speciality }}</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Language -->
      <div
        class="w-full flex flex-col justify-start h-fit space-y-2"
        aria-label="Available languages"
        role="listbox"
      >
        <h3 class="sm:text-lg font-medium text-dentiq-muted-darkest">
          Select Language <span class="text-dentiq-muted-semiLight">*</span>
        </h3>
        <div class="max-h-[240px] space-y-2 overflow-y-auto">
          <button
            v-for="language in allLanguages"
            :key="language"
            class="flex items-center px-4 py-3 min-w-full min-h-[65px] max-h-[65px] border rounded-lg focus:ring-2 focus:ring-blue-500 hover:bg-blue-50"
            :class="{
              'border-blue-500 bg-blue-50': selectedLanguage === language,
            }"
            :aria-label="`Select ${language} language`"
            :aria-selected="selectedLanguage === language"
            role="option"
            tabindex="0"
            @click="selectLanguage(language)"
          >
            <p class="font-medium text-sm sm:text-lg">{{ language }}</p>
          </button>
        </div>
      </div>
    </div>

    <!-- Step 2: Select Date and Time -->
    <section class="flex flex-col space-y-4 w-full max-h-fit" v-if="step === 2" aria-label="Select date and time">
      <h3 class="sm:text-lg font-medium text-dentiq-muted-darkest mb-4">
        Select Date <span class="text-dentiq-muted-semiLight">*</span>
      </h3>
      <div class="flex justify-between items-center">
        <button
          @click="prevMonth"
          class="text-gray-500 hover:text-black text-lg font-normal"
          :class="isCurrentMonth ? 'invisible' : ''"
          :aria-hidden="isCurrentMonth"
        >
          ←
        </button>
        <h4
          class="font-medium text-dentiq-muted-darkest text-sm sm:text-base"
          :class="hasNextMonth() ? '' : 'absolute left-[40%]'"
        >
          {{ formattedMonth }}
        </h4>
        <button
          @click="nextMonth"
          :class="hasNextMonth() ? 'block' : 'hidden'"
          class="text-gray-500 hover:text-black text-lg font-normal"
          aria-label="Navigate to next month"
        >
          →
        </button>
      </div>
      
      <div class="grid grid-cols-7 gap-2 text-center">
        <span
          v-for="day in days"
          :key="day"
          class="font-normal text-dentiq-muted-default text-sm sm:text-lg flex justify-center items-center"
          aria-hidden="true"
          >{{ day }}</span
        >
        <button
          v-for="date in calendarDates"
          :key="date.day"
          class="py-2 px-4 text-xs sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 flex justify-center items-center"
          :class="{
            'bg-blue-500 text-white': isSelectedDate(date.day),
            'text-dentiq-muted-dark bg-dentiq-muted-lighter cursor-not-allowed':
              date.isPastDate || !date.isSlotAvailable,
            'hover:bg-blue-50':
              !date.isPastDate &&
              date.isSlotAvailable &&
              !isSelectedDate(date.day),
          }"
          @click="
            !date.isPastDate && date.isSlotAvailable && selectDate(date.day)
          "
          :disabled="date.isPastDate || !date.isSlotAvailable"
          aria-label="Select date"
        >
          {{ date.day }}
        </button>
      </div>

      <h4 class="text-lg font-medium text-dentiq-muted-darkest">
        Select Time <span class="text-dentiq-muted-semiLight">*</span>
      </h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="time in timeSlots"

          :key="time"
          class="py-2 px-4 border rounded-lg cursor-pointer text-center text-sm sm:text-base"
          :class="{
            'bg-blue-500 text-white': isSelectedTime(time),
            'hover:bg-blue-50': !isSelectedTime(time),
          }"
          @click="selectTime(time)"
          aria-label="Select Time"
        >
          {{ time }}
        </button>
      </div>
    </section>

    <!-- Step 3: Reason for Visit -->
    <div class="flex flex-col w-full max-h-fit space-y-4" v-if="step === 3">
      <h4 class="text-lg font-medium text-dentiq-muted-darkest">
        Reason for Visit
        <span class="text-dentiq-muted-semiLight">(Optional)</span>
      </h4>
      <textarea
        v-model="reason"
        rows="3"
        class="w-full resize-none p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your reason here..."
      ></textarea>
    </div>

    <!-- Response Message with Success and go to bookings or Failure and retry  -->
    <div
      v-if="step === 4"
      class="flex flex-col items-center self-center space-y-6 text-center"
    >
      <div>
        <img
          v-if="isSuccess"
          src="/illustrations/success.png"
          alt="Success"
          class="w-50 h-50 mx-auto mb-4"
        />
      </div>
      <h2
        class="text-2xl font-bold"
        :class="{ 'text-green-500': isSuccess, 'text-red-500': !isSuccess }"
      >
        {{ isSuccess ? 'Booking Confirmed!' : 'Booking Failed' }}
      </h2>
      <p class="text-gray-600">{{ submissionMessage }}</p>
      <div v-if="isSuccess">
        <button
          @click="redirectToBookings"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go to Bookings
        </button>
      </div>
      <div v-else>
        <button
          @click="resetToFirstStep"
          class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div
      class="min-w-full text-sm sm:text-base"
      :class="{
        'justify-end': step < 2,
        'justify-between': step >= 2 && step <= 3,
        hidden: step > 3,
        flex: step <= 3,
      }"
      aria-label="Navigation buttons"
    >
      <button
        v-if="step > 1"
        class="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-blue-500"
        @click="goStepBack"
        aria-label="Go to previous step"
      >
        Previous
      </button>
      <button
        class="px-6 py-3 self-end text-white font-medium rounded-lg focus:ring-2 focus:ring-blue-500"
        :class="
          !canProceed
            ? 'bg-dentiq-muted-light'
            : 'bg-blue-500 hover:bg-blue-600'
        "
        :disabled="!canProceed"
        @click="handleSteps()"
        aria-label="Go to next step or Submit"
      >
        {{ step === 3 ? 'Submit' : 'Next' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from 'vue';
import { getMonth, getYear } from 'date-fns';
import { postAppointment } from '@/services/appointmentService';

// Define Types
interface Availability {
  date: string;
  times: string[];
}

interface Dentist {
  id: string;
  name: string;
  speciality: string;
  languages: string[];
  availability: Availability[];
  image?: string;
}

interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  services: string[];
  firstAvailableTime: string;
  languages: string[];
  dentists: Dentist[];
}

// Props
const props = defineProps({
  clinic: {
    type: Object as () => Clinic,
    required: true,
  },
});

// Method to step back
const goStepBack = () => {
  if (step.value > 1) {
    step.value--;
  }
};

// Redirect to Bookings
const redirectToBookings = () => {
  window.location.href = '/bookings';
};

// Reset to First Step
const resetToFirstStep = () => {
  step.value = 1;
  selectedDoctor.value = null;
  selectedDay.value = null;
  selectedTime.value = null;
  reason.value = '';
};

// Reactive state for screen size
const isMobile = ref(window.innerWidth < 768);

// Update `isMobile` value on window resize
const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

// Listen for resize events
onMounted(() => {
  window.addEventListener('resize', updateIsMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile);
});

// Check if the current month is the selected month
const isCurrentMonth = computed(() => {
  const today = new Date();
  return currentYear.value === today.getFullYear() && currentMonth.value === today.getMonth();
});


// State
const selectedLanguage = ref<string | null>('Any Language');
const selectedDoctor = ref<Dentist | null>(null);
const selectedDay = ref<number | null>(null);
const selectedMonth = ref<number | null>(null);
const selectedYear = ref<number | null>(null);
const selectedTime = ref<string | null>(null);
const reason = ref<string>('');

// Languages
const allLanguages = computed(() => [
  'Any Language',
  ...props.clinic.languages,
]);

// Doctor Availability
const hasUpcomingAvailability = (doctor: Dentist) => {
  const today = new Date();
  return doctor.availability.some((slot) => new Date(slot.date) >= today);
};

// Available Doctors
const availableDoctors = computed(() =>
  props.clinic.dentists.filter(hasUpcomingAvailability)
);

// Validation
const canProceed = computed(() => {
  if (step.value === 1) return selectedDoctor.value && selectedLanguage.value;
  if (step.value === 2) return selectedDay.value && selectedTime.value;
  if (step.value === 3) return !!reason.value || true; // Reason is optional
  return false;
});

const step = ref(1);

const isSelectedDate = (date: number) => {
  return selectedDay.value === date;
};

// Calendar Logic
const currentMonth = ref(getMonth(new Date()));
const currentYear = ref(getYear(new Date()));
const days = ref(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);

const timeSlots = computed(() => {
  if (!selectedDoctor.value || selectedDay.value === null) {
    return [];
  }

  // Construct the full date context with month and year
  const selectedFullDate = new Date(
    currentYear.value,
    currentMonth.value,
    selectedDay.value
  );

  // Find the availability for the selected date
  const availability = selectedDoctor.value.availability.find(
    (slot) =>
      new Date(slot.date).toDateString() === selectedFullDate.toDateString()
  );

  return availability ? availability.times : [];
});

const hasNextMonth = ref(() => {
  const { month: maxMonth, year: maxYear } = latestAvailableMonthYear.value;
  return (
    currentYear.value < maxYear ||
    (currentYear.value === maxYear && currentMonth.value < maxMonth)
  );
});

const handleSteps = () => {
  if (step.value < 3) {
    step.value++;
  } else {
    submit();
    step.value++;
  }
};

// Calendar Dates
const calendarDates = computed(() => {
  const daysInMonth = new Date(
    currentYear.value,
    currentMonth.value + 1,
    0
  ).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentYear.value, currentMonth.value, i + 1);
    const isPastDate = date < today;

    const isSlotAvailable = selectedDoctor.value
      ? selectedDoctor.value.availability.some(
          (availability) =>
            new Date(availability.date).toDateString() === date.toDateString()
        )
      : false;

    return { day: i + 1, isPastDate, isSlotAvailable };
  });
});

// Formatted Month
const formattedMonth = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
});

// Get the first upcoming available month and year for a doctor
const getEarliestAvailableMonthYear = (doctor: Dentist) => {
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize time to avoid mismatches

  // Filter for upcoming dates only
  const upcomingDates = doctor.availability
    .map((slot) => new Date(slot.date))
    .filter((date) => date >= today);

  if (upcomingDates.length === 0) {
    // If no upcoming dates, default to the current month and year
    return { month: currentMonth.value, year: currentYear.value };
  }

  // Find the earliest upcoming date
  const earliestUpcomingDate = upcomingDates.reduce((earliest, current) =>
    current < earliest ? current : earliest
  );

  return {
    month: getMonth(earliestUpcomingDate),
    year: getYear(earliestUpcomingDate),
  };
};

// Methods for navigating the calendar
const nextMonth = () => {
  const { month: maxMonth, year: maxYear } = latestAvailableMonthYear.value;
  if (
    currentYear.value < maxYear ||
    (currentYear.value === maxYear && currentMonth.value < maxMonth)
  ) {
    if (currentMonth.value === 11) {
      currentMonth.value = 0;
      currentYear.value += 1;
    } else {
      currentMonth.value += 1;
    }
    selectedMonth.value = currentMonth.value;
    selectedYear.value = currentYear.value;
    selectedDay.value = null; // Reset selected date
  }
};

const prevMonth = () => {
  const today = new Date();
  const currentDateMonth = today.getMonth();
  const currentDateYear = today.getFullYear();
  if (
    currentYear.value > currentDateYear ||
    (currentYear.value === currentDateYear &&
      currentMonth.value > currentDateMonth)
  ) {
    if (currentMonth.value === 0) {
      currentMonth.value = 11;
      currentYear.value -= 1;
    } else {
      currentMonth.value -= 1;
    }
    selectedMonth.value = currentMonth.value;
    selectedYear.value = currentYear.value;
    selectedDay.value = null; // Reset selected date
  }
};

// Methods for selecting doctor, language, date, time, and submitting
const selectDoctor = (doctor: Dentist) => {
  selectedDoctor.value = doctor;
  selectedDay.value = null;
  selectedTime.value = null;

  const { month, year } = getEarliestAvailableMonthYear(doctor);
  currentMonth.value = month;
  currentYear.value = year;
  selectedMonth.value = month;
  selectedYear.value = year;
};
const selectLanguage = (language: string) =>
  (selectedLanguage.value = language);
const selectDate = (date: number) => {
  selectedDay.value = date;
  selectedTime.value = null; // Reset time when a new date is selected
};
const selectTime = (time: string) => (selectedTime.value = time);
const isSelectedTime = (time: string) => selectedTime.value === time;
const isSuccess = ref(false);
const submissionMessage = ref('');

const latestAvailableMonthYear = computed(() => {
  if (!selectedDoctor.value)
    return { month: currentMonth.value, year: currentYear.value };

  const allDates = selectedDoctor.value.availability.map(
    (a) => new Date(a.date)
  );
  if (allDates.length === 0)
    return { month: currentMonth.value, year: currentYear.value };

  const latestDate = allDates.reduce((latest, current) =>
    current > latest ? current : latest
  );
  return {
    month: latestDate.getMonth(),
    year: latestDate.getFullYear(),
  };
});

// Submit the appointment
const submit = async () => {
  const appointment = {
    clinic: props.clinic.name,
    doctor: selectedDoctor.value,
    time: selectedTime.value,
    day: selectedDay.value,
    month: selectedMonth.value,
    year: selectedYear.value,
    reason: reason.value,
  };

  try {
    await postAppointment(appointment);

    // Success
    isSuccess.value = true;
    submissionMessage.value = `Your booking for ${selectedTime.value} on ${selectedDay.value}/${
      selectedMonth.value + 1
    }/${selectedYear.value} with Dr. ${
      selectedDoctor.value.name
    } at ${props.clinic.name} has been confirmed! 🎉`;
  } catch (error) {
    // Failure
    isSuccess.value = false;
    submissionMessage.value = 'Failed to submit the booking. Please try again.';
    console.error('Error submitting booking:', error);
  }
};
</script>

<style scoped>
button:hover {
  opacity: 0.9;
}
</style>
