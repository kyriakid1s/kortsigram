<script setup>
import { RouterLink, RouterView } from 'vue-router';
import SideBar from './components/SideBar.vue';
</script>

<template>
    <div class="w-screen flex bg-black p-0 m-0">
        <SideBar class="w-[15vw]" />
        <RouterView class="flex-auto overflow-auto" />
    </div>
</template>
