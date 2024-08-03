<script setup>
import Header from '../components/Header.vue';
import { ref, onMounted, watch } from 'vue';
import axios from '@/common/axios.js';
const code = ref('sx5d');
const resetBet = ref([]);

onMounted(() => {
    axios.get('/me/profile').then((res) => {
        axios.get(`/sessions/get/${code.value}?results=20`).then((res) => {
            console.log(res.docs);

            resetBet.value = res.docs;
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
})
watch(code, (newVal) => {
    axios.get(`/sessions/get/${newVal}?results=20`).then((res) => {
        console.log(res.docs);
        resetBet.value = res.docs;
    }).catch((err) => {
        console.log(err);
    });
})
const changeCode = (value) => {
    console.log(value);

    code.value = value;
}

</script>

<template>
    <div class="trend">
        <Header title="xu huong" />
        <a-row style="justify-content: space-around; display: flex; margin-bottom: 10px;">
            <a-col :span="6">
                <a-button @click="changeCode('sx5d')">Phòng 1</a-button>
            </a-col>
            <a-col :span="6">
                <a-button @click="changeCode('xs2')">Phòng 2</a-button>
            </a-col>
        </a-row>
        <div class="content">
            <!-- <h1 style="text-align: center;">Xu hướng</h1> -->

            <div class="table">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 100px;">Mã Đơn</th>
                            <th colspan="5">Kết quả</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="result in resetBet">
                            <td>
                                <div style="font-size: 14px;">{{ result.id }}</div>
                            </td>
                            <td v-for="r in result?.betData">
                                <a-typography-text class="result_item2"
                                    style="color: #000; font-size: 16px; display: block; text-align: center;">
                                    {{ r }}
                                </a-typography-text>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- <div id="profile">
        <div class="info">
            <a-space align="center" style="display: flex; justify-content: space-around;">
                <HomeOutlined style="color: #000; font-size: 25px; display: block;" @click="router.push('/')" />
                <a-avatar :size="64" :src="staticUrl + user.avatar" :alt="user.username"></a-avatar>
                <a-typography.Title style="color: #000; font-size: 18px;" class="notranslate ">{{ user.username
                    }}</a-typography.Title>
            </a-space>
        </div>

        <div class="info_description">
            <a-row gutter="10" style="text-align: center; justify-content: center;">
                <a-col :span="8">
                    <a-space direction="vertical">
                        <a-typography.Title level="5" style="color: #000; display: block; height: 30px;">
                            Số dư tài khoản
                        </a-typography.Title>
                        <a-typography.Title level="5" style="color: #000; font-size: 20px;" class="notranslate ">
                            {{ formattedBalanceUser }}
                        </a-typography.Title>
                    </a-space>
                </a-col>
            </a-row>
        </div>
    </div> -->
</template>
<style>
.content{
    background-color: #fff;
    margin: 0 10px;
}
.result_item2 {
    width: 30px;
    height: 30px;
    /* background-color: rgb(245 167 173); */
    border: 1px solid #ccc;
    background-color: #fff !important;
    /* margin: 5px; */
    border-radius: 100%;
    margin: auto;

}
.trend{
    min-height: 100vh;
}
table,
th,
td {
    border: 1px solid #ccc;
}
.table {
    margin: 0 auto;
    width: 100%;
}
table {
    width: 100%;
    border-collapse: collapse;
}
thead{
    background-color: rgb(221, 144, 196);
    color: #fff;
    padding: 10px 0;
}
th, td {
    padding: 10px 0;
    text-align: center;
}
</style>