<template>
    <div>
        <main
            class="text-white w-full xl:max-w-[50%] flex flex-col lg:m-[0_auto_30px] grow py-10 px-20 text-[16px]"
        >
            <header class="flex border-b border-[rgba(255,255,255,0.2)] pb-20">
                <div class="flex justify-center w-[45%]">
                    <img
                        class="rounded-full w-[150px] h-[150px]"
                        :src="userData.profilePicture"
                        alt="eisai nmlkas"
                    />
                </div>
                <section class="flex flex-col">
                    <div class="mb-2">
                        <b>{{ userData?.username }}</b>
                    </div>
                    <ul class="flex justify-start mb-[10px]">
                        <li class="mr-[40px]">
                            <b>{{ userData.posts?.length }}</b> posts
                        </li>
                        <li class="mr-[40px]">
                            <b>{{ userData.followers?.length }}</b> followers
                        </li>
                        <li class="mr-[40px]">
                            Following
                            <b>{{ userData.following?.length }}</b> users
                        </li>
                    </ul>
                    <div class="text-sm">
                        Dimitris Kyriakidis <br />🏠Thessaloniki<br />
                        ✈️Hellenic Air Force <br />•Ένας φράχτης, ένα πήδημα και
                        μια χειρονομία.
                    </div>
                </section>
            </header>
            <section class="grid auto-cols-auto grid-cols-3 gap-2 my-4">
                <div
                    class="w-[33,3%] h-[33,3%]"
                    v-for="post in userData.posts"
                    :key="post.id"
                >
                    <img :src="post.imageURL" alt="wisia" />
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Profile',
    components: {},
    data() {
        return {
            userData: [],
        };
    },
    methods: {
        async fetchUserProfile() {
            await axios
                .get(
                    `http://localhost:3000/api/users/${this.$route.params.user}`,
                    {
                        withCredentials: true,
                    }
                )
                .then((res) => {
                    res.data.posts = res.data.posts.reverse();
                    this.userData = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
    created() {
        this.fetchUserProfile();
    },
};
</script>
