<template>
  <!-- Conditional if no available doctors -->
  <div v-if="availableDoctors.length === 0" class="text-gray-500 text-center px-10 py-20">
    <p>Sorry, no doctors are currently available for appointments. Please try again later.</p>
  </div>

  <div v-else class="p-8 flex flex-col items-end space-y-4">
    <!-- Progress Bar -->
    <div class="w-[95%] flex self-start justify-between items-center mb-4">
      <div v-for="n in 3" :key="n" class="flex-1 h-2 mx-1 rounded-full"
           :class="{'bg-blue-500': step >= n, 'bg-gray-300': step < n}"></div>
    </div>

    <!-- Step 1: Select Doctor and Language -->
    <div class="flex flex-row space-x-2 w-full max-h-fit" v-if="step === 1">
      <!-- Doctors -->
      <div class="w-full flex flex-col justify-start h-fit max-h-[400px] space-y-2 overflow-y-scroll">
        <h3 class="text-lg font-medium text-dentiq-muted-darkest">
          Select Doctor <span class="text-dentiq-muted-semiLight">*</span>
        </h3>
        <div
            v-for="doctor in availableDoctors"
            :key="doctor.id"
            class="flex items-center px-4 min-h-[65px] max-h-[65px] border rounded-xl cursor-pointer hover:bg-dentiq-muted-lightest"
            :class="{
            'border-blue-500 bg-blue-50': selectedDoctor?.id === doctor.id,
            'cursor-not-allowed text-dentiq-muted-light': !hasUpcomingAvailability(doctor)
          }"
            @click="hasUpcomingAvailability(doctor) && selectDoctor(doctor)"
            :aria-disabled="!hasUpcomingAvailability(doctor)"
        >
          <div>
            <h4 class="font-medium text-lg">{{ doctor.name }}</h4>
            <p class="text-sm text-gray-500">{{ doctor.speciality }}</p>
          </div>
        </div>
      </div>

      <!-- Language -->
      <div class="w-full flex flex-col h-fit max-h-[400px] justify-start space-y-2">
        <h3 class="text-lg font-medium text-dentiq-muted-darkest">
          Select Language <span class="text-dentiq-muted-semiLight">*</span>
        </h3>
        <div
            v-for="language in allLanguages"
            :key="language"
            class="flex items-center px-4 min-h-[65px] max-h-[65px] border rounded-lg cursor-pointer hover:bg-dentiq-muted-lightest"
            :class="{ 'border-blue-500 bg-blue-50': selectedLanguage === language }"
            @click="selectLanguage(language)"
        >
          <p class="font-medium text-lg">{{ language }}</p>
        </div>
      </div>
    </div>

    <!-- Step 2: Select Date and Time -->
    <div class="flex flex-col space-y-4 w-full max-h-fit" v-if="step === 2">
      <h3 class="text-lg font-medium text-dentiq-muted-darkest mb-4">
        Select Date <span class="text-dentiq-muted-semiLight">*</span>
      </h3>
      <div class="flex justify-between items-center">
        <button @click="prevMonth" class="text-gray-500 hover:text-black text-lg font-normal">←</button>
        <h4 class="font-medium text-dentiq-muted-darkest text-md" :class="hasNextMonth ? '' : 'absolute left-[40%]' ">{{ formattedMonth }}</h4>
        <button @click="nextMonth" :class="hasNextMonth ? 'block' : 'hidden'" class="text-gray-500 hover:text-black text-lg font-normal">→</button>
      </div>
      <div class="grid grid-cols-7 gap-2 text-center">
        <span v-for="day in days" :key="day" class="font-normal text-dentiq-muted-default">{{ day }}</span>
        <button
            v-for="date in calendarDates"
            :key="date.day"
            class="py-2 px-4 text-sm rounded-lg cursor-pointer"
            :class="{
            'bg-blue-500 text-white': isSelectedDate(date.day),
            'text-dentiq-muted-dark bg-dentiq-muted-lighter cursor-not-allowed': date.isPastDate || !date.isSlotAvailable,
            'hover:bg-gray-200': !date.isPastDate && date.isSlotAvailable && !isSelectedDate(date.day),
          }"
            @click="!date.isPastDate && date.isSlotAvailable && selectDate(date.day)"
            :disabled="date.isPastDate || !date.isSlotAvailable"
        >
          {{ date.day }}
        </button>
      </div>

          <!--    Section/Languages      -->

          <div class="w-1/2 space-y-5 ">
            <h5 class="text-dentiq-body-large font-semibold text-dentiq-muted-darkest" >Languages</h5>
            <!--     List of Languages       -->
            <div class="space-y-3 max-h-[140px] overflow-y-scroll">
              <!--    Dentist Info       -->
              <div v-for="lang in clinic.languages" :key="lang" class="flex items center space-x-3">
                <div class="flex flex-row space-x-2 justify-center items-center">
                  <img src="/images/users/user-avatar.svg" alt="Dentist Placeholder" class="w-11 h-11 rounded-full bg-dentiq-muted-lightest border-2 border-dentiq-muted-light" />
                  <h6 class="text-dentiq-body">{{lang}}</h6>
                </div>
              </div>
            </div>
          </div>
          <!--    End of Section      -->
        </div>
      </div>
    </div>
      <h4 class="text-lg font-medium text-dentiq-muted-darkest">Select Time <span class="text-dentiq-muted-semiLight">*</span></h4>
      <div class="flex flex-wrap gap-2">
        <div
            v-for="time in timeSlots"
            :key="time"
            class="py-2 px-4 border rounded-lg cursor-pointer text-center"
            :class="{ 'bg-blue-500 text-white': isSelectedTime(time), 'hover:bg-gray-200': !isSelectedTime(time) }"
            @click="selectTime(time)"
        >
          {{ time }}
        </div>
      </div>
    </div>

</template>

<script setup lang="ts">
import { faPhone, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { defineProps } from "vue";

const defaultPlaceholder = new URL(
    "/images/clinics/clinic-placeholder.svg",
    import.meta.url
).href;

let props = defineProps({
    clinic: {
        type: Object,
        required: true,
    },
});

// Props
const clinic = props.clinic;

</script>