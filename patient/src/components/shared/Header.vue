<template>
  <nav
    class="flex h-[80px] bg-white px-4 rounded-2xl border-dentiq-muted-semilight border-2"
  >
    <ul
      class="flex flex-row justify-between items-center w-full space-x-2 md:space-x-6"
    >
      <li>
        <a href="/" class="items-center space-x-2 flex min-w-full">
          <img src="/svgs/logo-dark.svg" alt="Logo" />
          <h1
            class="hidden sm:block text-dentiq-text-primary font-archivoBlack text-dentiq-h2"
          >
            Denti<span class="text-dentiq-text-secondary">Q</span>
          </h1>
        </a>
      </li>
      <div class="flex items-center gap-3">
        <NotificationsList />
        <ProfileDropdown />
      </div>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import NotificationsList from '@/components/shared/NotificationsList.vue';
import ProfileDropdown from '@/components/shared/ProfileDropdown.vue';
</script>
