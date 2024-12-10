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
        <!--    Body     -->
        <div class="flex flex-wrap w-full bg p-7">
          <!--    Section/Doctors      -->
          <div class="w-1/2 space-y-5 ">
            <h5 class="text-dentiq-body-large font-semibold text-dentiq-muted-darkest" >Doctors</h5>
            <!--     List of Dentists       -->
            <div class="space-y-3 max-h-[140px] overflow-y-scroll">
              <!--    Dentist Info       -->
              <div v-for="dentist in clinic.dentists" :key="dentist.id" class="flex items center space-x-3">
                <div class="flex flex-row space-x-2 justify-center items-center">
                  <img src="/images/users/user-avatar.svg" alt="Dentist Placeholder" class="w-11 h-11 rounded-full bg-dentiq-muted-lightest border-2 border-dentiq-muted-light" />
                  <div class="space-y-1">
                    <h6 class="text-dentiq-body">{{dentist.name}}</h6>
                    <p class="text-dentiq-body-small text-dentiq-muted-darker bg-dentiq-muted-lighter px-2 py-1 rounded-lg">{{dentist.speciality}}</p>
                  </div>
                </div>
              </div>
            </div>
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