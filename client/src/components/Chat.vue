<template>
    <div class="w-full flex flex-col">
        <header
            class="w-full h-[10%] flex items-center p-5 text-lg border-b border-[rgba(255,255,255,0.2)]"
        >
            <img
                class="w-[44px] h-[44px] rounded-full mr-5"
                :src="receiverId.profilePicture"
            />
            <p>
                {{ receiverId.username }}
            </p>
        </header>
        <main class="w-full overflow-auto" ref="chat">
            <div
                class="flex flex-col"
                v-for="message in messages"
                :key="message.id"
            >
                <p
                    :class="{
                        'ml-auto': message.senderId == this.currentUserId,
                    }"
                    class="m-2 p-2 px-4 bg-[#262626] rounded-r-full rounded-l-full w-fit flex rounded-xl text-sm"
                >
                    {{ message.message }}
                </p>
                <div ref="bottom"></div>
            </div>
        </main>

        <div
            class="w-[95%] h-auto p-4 m-auto mx-2 mb-3 border border-[rgba(255,255,255,0.2)] rounded-r-full rounded-l-full"
        >
            <input
                @keyup.enter="sendMessage"
                type="text"
                placeholder="Message..."
                v-model="newMessage"
                class="w-full bg-transparent outline-none"
            />
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import socket from '../socket.js';
export default {
    name: 'Chat',
    props: ['members', 'conversationId', 'currentUserId'],
    data() {
        return {
            messages: [],
            newMessage: '',
            receiverId: this.members.filter((member) => {
                return member._id != this.currentUserId;
            })[0],
        };
    },
    methods: {
        async getMessages() {
            await axios
                .get(
                    `http://localhost:3000/api/messages/${this.conversationId}/messages`,
                    { withCredentials: true }
                )
                .then((res) => {
                    this.messages = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        async sendMessage() {
            if (this.newMessage == '') {
                return console.log(';grapse kati');
            }
            await axios
                .post(
                    'http://localhost:3000/api/messages/new-message',
                    {
                        receiverId: this.receiverId._id,
                        message: this.newMessage,
                    },
                    { withCredentials: true }
                )
                .then((res) => {
                    const message = this.messages.push(res.data);
                    this.newMessage = '';
                    //socket emit
                    socket.emit('private message', {
                        content: res.data.message,
                        to: res.data.receiverId,
                    });
                    this.scrollToLast();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        pushMessage(message) {
            this.messages.push(message);
        },
        scrollToLast() {
            this.$refs.chat.scrollTop =
                this.$refs.chat.lastElementChild.offsetTop;
        },
    },
    async mounted() {
        await this.getMessages();
        this.scrollToElement();
        socket.on('private message', ({ content, from }) => {
            const message = { message: content, senderId: from };
            this.pushMessage(message);
        });
    },
    updated() {
        this.scrollToLast();
    },
};
</script>

<style lang="scss" scoped></style>
