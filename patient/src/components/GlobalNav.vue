<script setup lang="ts">
import logo from './../../public/svgs/logo-dark.svg'
</script>

<template>
    <nav class="flex h-[80px] w-screen bg-white px-4">
        <ul class="flex flex-row justify-between items-center w-full">
            <li>
                <a href="/" class="flex flex-row items-center space-x-2">
                    <img :src=logo href="/" />
                    <h1 class="text-dentiq-text-primary font-archivoBlack text-dentiq-h2">Denti<span class="text-dentiq-text-secondary">Q</span></h1>
                </a>
            </li>
            <div class="w-full max-w-[800px]">
                <input placeholder="Search" class="w-full h-[48px] px-3 text-dentiq-text-dark rounded-[10px] items-center bg-dentiq-muted-lighter" />
            </div>
            <div class="flex flex-row">
                <li><a href="/profile">Nabil Al Sayed</a></li>
            </div>
        </ul>
    </nav>
</template>