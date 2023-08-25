<template>
    <div class="w-full">
        <Modal
            :modalActive="modalActive"
            class="w-full flex items-center justify-center"
        >
            <div
                v-if="image == ''"
                class="flex flex-col items-center justify-center w-full"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="white"
                    class="w-10 h-10 absolute top-0 right-0 cursor-pointer"
                    @click="
                        toggleModal;
                        $emit('close-modal');
                    "
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
                <div
                    class="border-b text-white text-lg w-full text-left rounded-t-lg p-2 bg-gray-700"
                >
                    <p class="text-left bg-gray-700">
                        Choose a photo or a video
                    </p>
                </div>
                <label
                    for="dropzone-file"
                    class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-b-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                    <div
                        class="flex flex-col items-center justify-center pt-5 pb-6"
                    >
                        <svg
                            class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                        </svg>
                        <p
                            class="mb-2 text-sm text-gray-500 dark:text-gray-400"
                        >
                            <span class="font-semibold">Click to upload</span>
                            or drag and drop
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                    </div>

                    <input
                        id="dropzone-file"
                        @change="onFileChange"
                        type="file"
                        class="hidden"
                    />
                </label>
            </div>
            <div
                v-else
                class="flex flex-col w-full h-full justify-centrer items-center"
            >
                <img :src="this.imagePreview" alt="" class="" />
                <button
                    class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    @click="uploadRequest"
                >
                    Upload
                </button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Modal from './Modal.vue';
import axios from 'axios';
export default {
    components: { Modal },
    data() {
        return {
            modalActive: true,
            image: '',
            imagePreview: '',
        };
    },
    methods: {
        toggleModal() {
            this.modalActive = !this.modalActive;
        },
        onFileChange(e) {
            const file = e.target.files[0];
            this.image = file;
            this.imagePreview = URL.createObjectURL(file);
            console.log(this.image);
        },
        async uploadRequest() {
            const formData = new FormData();
            formData.append('file', this.image);
            //Post to server
            await axios
                .post('http://localhost:3000/api/posts/newPost', formData, {
                    withCredentials: true,
                })
                .then((res) => {
                    console.log(res.data);
                    this.modalActive = !this.modalActive;
                    this.image = '';
                    this.imagePreview = '';
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>
