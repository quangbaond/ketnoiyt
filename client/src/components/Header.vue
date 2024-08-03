<script setup>
import GoogleTranslateSelect from '@google-translate-select/vue3';
import Logo from '@/assets/images/logo.png';
import backBtn from '@/assets/images/icons/backbtn.png';
import { LeftCircleOutlined } from '@ant-design/icons-vue';
const props = defineProps({
    title: {
        type: String,
        default: 'Đăng nhập'
    }
});
const back = () => {
    window.history.back();
}

</script>

<template>
    <a-row gutter="10"
        style="display: flex; margin:  10px; background-color: #fff;padding: 15px; align-content: center;">
        <a-col :span="3" @click="back">
            <!-- <LeftCircleOutlined :style="{ fontSize: '16px'}" /> -->
            <img :src="backBtn" alt="" srcset="">
        </a-col>
        <a-col :span="12" style="align-self: center;">
            <h3 style="color: red; font-size: 16px; font-weight: 600;">{{ props.title }}</h3>
        </a-col>
    </a-row>

</template>