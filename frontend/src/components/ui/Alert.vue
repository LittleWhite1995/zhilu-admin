<template>
    <div id="globalAlert"
        :class="['flex space-x-1.5 sm:space-x-2 items-center rounded-lg p-3 text-xs sm:p-4 sm:text-sm mb-4 fixed top-2 right-2 sm:top-4 sm:right-4 md:top-8 md:right-5 transition-all duration-200 ease-out z-50', alertStore.levelClassName, alertStore.alertStorage.isShow ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full']"
        role="alert">
        <svg v-if="alertStore.alertStorage.level==='info'" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" class="lucide lucide-info-icon lucide-info">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
        <svg v-else-if="alertStore.alertStorage.level === 'warning'" xmlns="http://www.w3.org/2000/svg" width="20"
            height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
        <svg v-if="alertStore.alertStorage.level === 'success'" xmlns="http://www.w3.org/2000/svg" width="20"
            height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" class="lucide lucide-circle-check-icon lucide-circle-check">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
        <svg v-if="alertStore.alertStorage.level === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x">
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
        </svg>
        <span class="font-medium">{{ alertStore.alertStorage.content }}</span>
    </div>
</template>


<script setup lang="ts">
import useAlertStore from "@/composables/store/useAlertStore";
import type { AlertLevel } from "@/types/AlertTypes";
import { onMounted, onUnmounted, ref } from "vue";
const alertStore = useAlertStore();
</script>
