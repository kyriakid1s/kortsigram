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
        {
            path: '/profile/:user?',
            name: 'profile',
            component: () => import('../components/Profile.vue'),
        },
        {
            path: '/newPost',
            name: 'newPost',
            component: () => import('../components/NewPost.vue'),
        },
    ],
});

export default router;
