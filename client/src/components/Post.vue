<template>
    <div
        class="w-[60%] h-full m-auto text-white border-b border-[rgba(255,255,255,0.2)]"
    >
        <header class="w-full h-10%">
            {{ username }}
        </header>
        <main class="w-full h-[80%]">
            <img
                class="w-full h-full m-auto object-cover"
                :src="src"
                alt="eisainmkls"
            />
        </main>
        <div class="flex-col flex w-full">
            <span v-for="comment in comments" :key="comments.id">
                {{ comment.postedBy.username }} egrapse {{ comment.comment }}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: ['src', 'username', 'comments'],
};
</script>

<style lang="scss" scoped></style>
