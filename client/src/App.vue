<script setup>
import { RouterLink, RouterView } from 'vue-router';
import SideBar from './components/SideBar.vue';
</script>

<template>
    <div class="w-screen flex bg-black">
        <SideBar class="w-[15vw]" />
        <RouterView />
    </div>
</template>
