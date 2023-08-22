<template>
    <div class="flex flex-col w-[70vw] h-screen">
        <div v-for="post in posts" :key="post.id">
            <Post
                :username="post.posts[0].author"
                :comments="post.posts[0].comments"
                :src="post.posts[0].imageURL"
            />
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
        };
    },
    methods: {
        async fecthPosts() {
            await axios
                .get('http://localhost:3000/api/posts/following', {
                    withCredentials: true,
                })
                .then((res) => {
                    this.posts = res.data;
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
