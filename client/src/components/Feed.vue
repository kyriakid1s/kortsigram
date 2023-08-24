<template>
    <div class="flex flex-col w-[70vw] h-screen text-white">
        <div v-for="post in posts" :key="post.id">
            <div v-for="item in post" :key="item.id">
                <div v-for="g in item" :key="g.id">
                    <Post
                        :username="g.author"
                        :comments="g.comments"
                        :src="g.imageURL"
                        :id="g._id"
                        :likes="g.likes"
                        :likesCount="g.likes.length"
                        :currentUserId="currentUserId"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Post from './Post.vue';
export default {
    name: 'Feed',
    components: { Post },
    data() {
        return {
            posts: [],
            currentUserId: '',
        };
    },
    methods: {
        async fecthPosts() {
            await axios
                .get('http://localhost:3000/api/posts/following', {
                    withCredentials: true,
                })
                .then((res) => {
                    this.posts = res.data.followingPosts;
                    this.currentUserId = res.data.currentUserId;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
    created() {
        this.fecthPosts();
    },
};
</script>

<style lang="scss" scoped></style>
