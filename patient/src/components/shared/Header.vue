<script setup lang="ts">
import Search from '@/components/home/Search.vue'
</script>

<template>
    <nav class="flex h-[80px] bg-white px-4 rounded-2xl border-dentiq-muted-semilight border-2">
        <ul class="flex flex-row justify-between items-center w-full space-x-2 md:space-x-6">
            <li>
                <a href="/public" class="items-center space-x-2 flex min-w-full">
                    <img src="/svgs/logo-dark.svg" alt="Logo" />
                    <h1 class="hidden sm:block  text-dentiq-text-primary font-archivoBlack text-dentiq-h2">Denti<span class="text-dentiq-text-secondary">Q</span></h1>
                </a>
            </li>
            <Search />
            <div class="flex flex-row items-center space-x-2">
                <div class="hidden sm:flex flex-col text-right">
                    <p class="text-dentiq-text-dark font-normal text-dentiq-body-small">Nabil Al Sayed</p>
                    <p class="text-dentiq-muted-default font-normal text-dentiq-body-small">Patient</p>
                </div>
                <img src="/svgs/user-avatar.svg" alt="User" class="h-[60px] w-[60px] border-4 rounded-full" />
            </div>
        </ul>
    </nav>
</template>