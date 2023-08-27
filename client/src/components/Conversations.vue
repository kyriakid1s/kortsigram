<template>
    <div class="flex w-full text-white h-full overflow-y-hidden">
        <div
            class="flex flex-col w-[30%] h-screen text-white p-5 text-lg border-r border-[rgba(255,255,255,0.2)]"
        >
            <header class="mb-4">
                <b>{{ currentUser.username }}</b>
            </header>
            <section><b>Messages</b></section>
            <div
                class="overflow-y-scroll"
                v-for="conversation in conversations"
                :key="conversation.id"
            >
                <div
                    @click="currentConversation = conversation"
                    class="flex w-full items-center text-sm mt-4 py-2 px-4 hover:bg-[rgba(255,255,255,0.2)] rounded-lg cursor-pointer"
                >
                    <img
                        class="mr-4 w-[56px] h-[56px] rounded-full"
                        :src="
                            conversation.members.filter((member) => {
                                return member._id != currentUser._id;
                            })[0].profilePicture
                        "
                    />
                    <span>{{
                        conversation.members.filter((member) => {
                            return member._id != currentUser._id;
                        })[0].username
                    }}</span>
                </div>
            </div>
        </div>
        <Chat
            class="w-[70%] mr-5 max-h-screen"
            v-if="currentConversation.length != 0"
            :members="currentConversation.members"
            :conversationId="currentConversation._id"
            :currentUserId="currentUser._id"
        />
    </div>
</template>

<script>
import axios from 'axios';
import socket from '../socket.js';
import Chat from './Chat.vue';

export default {
    name: 'Conversations',
    components: { Chat },
    data() {
        return {
            conversations: [],
            currentUser: [],
            currentConversation: [],
        };
    },
    methods: {
        async getCurrentUser() {
            await axios
                .get(`http://localhost:3000/api/users`, {
                    withCredentials: true,
                })
                .then((res) => {
                    this.currentUser = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        addIdToSocket(userId) {
            socket.auth = { userId };
            socket.connect();
        },
        async getConversations() {
            await axios
                .get('http://localhost:3000/api/conversations/', {
                    withCredentials: true,
                })
                .then((res) => {
                    this.conversations = res.data.conversations;
                    this.addIdToSocket(res.data.userId);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
    created() {
        this.getCurrentUser();
        this.getConversations();
    },
};
</script>

<style lang="scss" scoped></style>
