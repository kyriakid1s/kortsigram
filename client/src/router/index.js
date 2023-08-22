import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'feed',
            component: () => import('../components/Feed.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../components/Login.vue'),
        },
    ],
});

export default router;
