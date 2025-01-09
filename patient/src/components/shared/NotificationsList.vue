<template>
  <!-- NOTIFICATION BUTTON -->
  <div class="relative" ref="dropdownWrapper">
    <div class="relative h-fit w-fit">
      <button
        @click="toggleListVisibility"
        class="w-12 h-12 flex justify-center items-center cursor-pointer text-dentiq-muted-darker hover:bg-dentiq-muted-lighter rounded-full"
        :class="unseenNotifications > 0 ? 'text-dentiq-text-primary' : ''"
      >
        <font-awesome-icon :icon="faBell" class="text-xl" />
        <span
          v-if="unseenNotifications > 0"
          class="absolute flex items-center justify-center -bottom-2 -right-0 bg-dentiq-background-primary text-white w-6 h-6 rounded-full text-dentiq-caption font-semibold"
        >
          {{ unseenNotifications }}
        </span>
      </button>
    </div>

    <!-- NOTIFICATION LIST -->
    <div
      v-if="isOpen"
      class="absolute top-0 -right-24 min-[400px]:right-0 p-1 sm:w-72 w-[290px] bg-white shadow-md rounded-xl mt-16 z-50 overflow-hidden"
    >
      <div class="divide-y divide-gray-200 max-h-[320px] overflow-y-auto">
        <div v-if="notifications.length > 0">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="flex items-center justify-between p-4"
          >
            <div class="max-w-full flex flex-col justify-center">
              <p
                class="text-[15px] text-dentiq-muted-darkest truncate max-w-[225px] overflow-hidden"
              >
                {{ notification.message }}
              </p>
              <p class="text-[14px] text-dentiq-muted-default">
                {{ notification.date }}
              </p>
            </div>
            <button
              class="text-dentiq-muted-semiLight max-w-full h-12 cursor-pointer hover:text-red-500 rounded-full"
              @click="deleteNotification(notification)"
            >
              <font-awesome-icon :icon="faTrash" class="text-sm" />
            </button>
          </div>
        </div>
        <div v-else class="p-4 text-center text-base text-dentiq-muted-default">
          No notifications yet.
        </div>
        <button
          class="w-full h-[48px] rounded-b-lg text-red-500 text-dentiq-body-small bg-white hover:bg-dentiq-muted-lighter sticky bottom-0"
          @click="handleDeleteNotifications"
          v-if="notifications.length > 0"
        >
          Delete All Notifications
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { mqttClient, client } from '@/mqtt/mqtt';
import { TOPICS } from '@/mqtt/topics';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBell, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface Notification {
  id: number;
  message: string;
  date: string;
}

// Reactive state to store notifications
const notifications = ref<Notification[]>([]);

// State for visibility of the dropdown and unseen notifications
const isOpen = ref(false);
const unseenNotifications = ref(0);

// Ref to track the dropdown wrapper
const dropdownWrapper = ref<HTMLElement | null>(null);

// Function to add a notification
const addNotification = (message: string) => {
  notifications.value.push({
    id: Date.now(),
    message,
    date: new Date().toLocaleString(),
  });
  unseenNotifications.value += 1;
};

// Toggle visibility of the notification list
const toggleListVisibility = () => {
  isOpen.value = !isOpen.value;

  // Clear unseen count when list is opened
  if (isOpen.value) {
    unseenNotifications.value = 0;
  }
};

// Function to delete all notifications
const handleDeleteNotifications = () => {
  notifications.value = [];
  unseenNotifications.value = 0;
  isOpen.value = false;
};

// Function to delete a single notification
const deleteNotification = (notification: Notification) => {
  const index = notifications.value.findIndex((n) => n.id === notification.id);
  if (index !== -1) {
    notifications.value.splice(index, 1);
    unseenNotifications.value -= 1;
  }
};

// Function to handle clicks outside the dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (
    dropdownWrapper.value &&
    !dropdownWrapper.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

// Subscribe and handle MQTT messages
onMounted(async () => {
  // Attach the outside click listener
  document.addEventListener('click', handleClickOutside);
  const token = localStorage.getItem('token');

  // Retrieves all notifications onMount
  const response = await axios.get(
    `${import.meta.env.VITE_API_GATEWAY}/notification/get`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // If there are notifications, add them to the list.
  if (response.data.data.status === 200) {
    const notifications = response.data.data.message;
    notifications.map((notification) => addNotification(notification.message));
  }

  try {
    console.log('[MQTT]: Initializing MQTT client...');
    const userId = localStorage.getItem('userId');
    await mqttClient.setup(userId!);

    // Handle incoming messages
    client.on('message', (topic: string, message: any) => {
      const validatedTopic = validateTopic(topic);
      if (!validatedTopic) return;

      const payload = JSON.parse(message.toString());
      console.log(`[MQTT]: Received message on topic ${topic}:`, payload);
      addNotification(payload.message);
    });
  } catch (error) {
    console.error('[MQTT]: Error during setup or subscription', error);
  }
});

// Clean up on unmount
onUnmounted(() => {
  // Detach the outside click listener
  document.removeEventListener('click', handleClickOutside);

  console.log(
    `[MQTT]: Unsubscribing from ${TOPICS.SUBSCRIBE.NOTIFICATION_CREATED}`
  );
  client.unsubscribe(TOPICS.SUBSCRIBE.NOTIFICATION_CREATED, (err) => {
    if (err) {
      console.error('[MQTT]: Unsubscription error:', err);
    } else {
      console.log('[MQTT]: Successfully unsubscribed.');
    }
  });
});

const validateTopic = (topic: string): boolean => {
  return (
    TOPICS.SUBSCRIBE.NOTIFICATION_APPOINTMENT_CREATED,
    TOPICS.SUBSCRIBE.NOTIFICATION_APPOINTMENT_BOOKED,
    TOPICS.SUBSCRIBE.NOTIFICATION_APPOINTMENT_CANCEL
  );
};
</script>
