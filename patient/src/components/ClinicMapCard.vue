<template>
    <!-- Placeholder Image -->
    <div class="absolute flex flex-col left-14 top-0 items-center bg-white rounded-3xl max-h-[480px] w-[200px] md:w-[310px] overflow-hidden shadow-lg shadow-dentiq-muted-light border-dentiq-border-shadowStrenghter border-[2px] font-archivo">
      <div class="w-full max-h-[220px] bg-dentiq-muted-lighter justify-center items-center overflow-hidden">
        <img
        :src="clinic.image || defaultPlaceholder"
        alt="Clinic Placeholder Image"
        class="w-[100%] h-[100%]"
        />
      </div>
      <div class="w-full p-2 md:p-4 space-y-[10px] md:space-y-[20px]">
        
        <div class="flex flex-col w-full justify-center items-start space-y-[5px]">
          <h1 class="font-semibold w-fit text-dentiq-h4 md:text-dentiq-h3">{{ clinic.name }}</h1>
          <h2 class="font-normal w-full text-dentiq-body-small md:text-dentiq-body text-dentiq-muted-default">{{ clinic.address }}</h2>
        </div>

        <div class="flex flex-col items-center w-full space-y-[10px] md:space-y-[20px]">
          
          <div class="flex flex-row w-full">
            <h2 class="font-normal w-full text-dentiq-caption md:text-dentiq-body text-dentiq-muted-default">First Availabillity</h2>
            <div class="flex flex-row w-full space-x-[5px] justify-center items-center">
              <FontAwesomeIcon icon="circle" class="text-green-500" />
              <h2 class="font-normal w-fit text-dentiq-caption md:text-dentiq-body">{{ clinic.firstAvailableTime }}</h2>
            </div>
          </div>

          <div class="flex flex-wrap w-full gap-[5px] md:gap-[10px]">
            <p v-for="service in visibleServices" class="text-dentiq-caption-small md:text-dentiq-body-small px-2 py-[7px] rounded-lg text-dentiq-muted-darker bg-dentiq-muted-lighter">{{ service }}</p>
            <p v-if="hiddenServices.length > 0" class="text-dentiq-caption-small md:text-dentiq-body-small px-2 py-[7px] rounded-lg text-dentiq-muted-darker bg-dentiq-muted-lighter">+{{ hiddenServices.length }}</p>
          </div>

          <button @click="openModal" class="flex items-center justify-center space-x-2 w-full bg-dentiq-background-secondary py-2 rounded-xl">
            <span class="text-dentiq-button-light font-semibold text-dentiq-body-small md:text-dentiq-body-large">View</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from "vue";
  import { library } from "@fortawesome/fontawesome-svg-core";
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import { faCircle, faCalendar ,faB ,faStar } from "@fortawesome/free-solid-svg-icons";
  
  // Add icons to the library
  library.add(faStar,faCalendar, faB, faCircle);
  
  // Props
  const props = defineProps({
    clinic: {
      type: Object,
      required: true,
    },
  });

  // Services Logic
  const services = props.clinic.services || [];

  // Compute visible and hidden services
  const visibleServices = computed(() => services.slice(0, 5));
  const hiddenServices = computed(() => services.slice(5));


  // Open Modal Function
  // TODO: Implement Modal
  const openModal = () => {
    console.log("Open Modal");
  };
  
  const defaultPlaceholder = new URL(
    "/images/clinic-placeholder.svg",
    import.meta.url
  ).href;
  </script>
  