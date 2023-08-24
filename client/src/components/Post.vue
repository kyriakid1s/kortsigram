<template>
    <div
        class="w-[468px] m-auto pt-5 text-white border-b border-[rgba(255,255,255,0.2)]"
    >
        <header class="w-full flex h-10% items-center mb-3">
            <img :src="src" class="rounded-full w-[32px] h-[32px] mr-2" />
            <a :href="`http://localhost:5173/profile/${this.username}`"
                ><b>{{ username }}</b></a
            >
        </header>
        <main class="w-full">
            <img
                class="w-[648px] h-[585px] m-auto"
                :src="src"
                alt="eisai mkls"
            />
        </main>
        <div class="flex pb-2">
            <HeartIcon
                class="w-6 h-6 cursor-pointer hover:text-[rgba(255,255,255,0.5)]"
                v-if="!isLiked"
                @click="
                    Like();
                    likesCount++;
                "
            />
            <svg
                v-if="isLiked"
                @click="
                    Like();
                    likesCount--;
                "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="red"
                class="w-6 h-6 cursor-pointer"
            >
                <path
                    d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                />
            </svg>
            <p class="ml-2">Liked by {{ likesCount }}</p>
        </div>
        <div class="flex-col flex w-full text-sm">
            <span v-for="comment in comments" :key="comments.id" class="mb-0.5">
                <a
                    class="mr-1"
                    :href="`http://localhost:5173/profile/${comment.postedBy.username}`"
                    ><b>{{ comment.postedBy.username }}</b></a
                >
                {{ comment.comment }}
            </span>
            <form action="" @submit.prevent class="flex w-full items-center">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    v-model="comment"
                    class="bg-inherit outline-none mb-2 text-sm w-full"
                />
                <button
                    v-if="comment.length != 0"
                    class="text-[#1877F2] text-[1.1rem] cursor-pointer hover:text-[#e0f1ff]"
                    @click="postComment"
                >
                    Post
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import { HeartIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';
export default {
    props: [
        'src',
        'username',
        'comments',
        'id',
        'likesCount',
        'likes',
        'currentUserId',
    ],
    components: { HeartIcon },
    data() {
        return {
            isLiked: false,
            comment: '',
        };
    },
    methods: {
        async Like() {
            console.log('apok');
            await axios
                .post(
                    `http://localhost:3000/api/posts/like/${this.id}`,
                    {},
                    {
                        withCredentials: true,
                    }
                )
                .then((res) => {
                    this.isLiked = !this.isLiked;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        checkIfUserLikesPost() {
            this.isLiked = this.likes.includes(this.currentUserId);
        },
        async postComment() {
            await axios
                .post(
                    `http://localhost:3000/api/comments/postComment/${this.id}`,
                    {
                        comment: this.comment,
                    },
                    { withCredentials: true }
                )
                .then((res) => {
                    console.log(res.data.comment.postedBy.username);
                    this.comment = '';
                    this.comments.push({
                        postedBy: {
                            username: res.data.comment.postedBy.username,
                        },
                        comment: res.data.comment.comment,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
    created() {
        this.checkIfUserLikesPost();
    },
};
</script>
