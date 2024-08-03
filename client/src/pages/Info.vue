<script setup>
import { getStorage } from '@/common'
import { onMounted, watch, computed } from 'vue'
import { formatCurrency, formatDateTime, openLink } from '../common';
import iconDeposit from '@/assets/images/icons/profile/deposit.svg'
import { CaretRightOutlined, HomeOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import axios from '@/common/axios.js';
import { useRouter } from 'vue-router';
import { cloneDeep } from 'lodash-es';
import { layer } from '@layui/layer-vue';
import { useStore } from 'vuex';
import { socket } from '@/socket'

const user = ref(getStorage('user'))
const staticUrl = import.meta.env.VITE_APP_STATIC_URL ?? 'http://localhost:3000'
const formattedBalanceUser = ref(formatCurrency(user.balance))
const formattedBetTodayUser = ref(formatCurrency(user.betToday))
const router = useRouter();
const dataSource = ref([]);
const text = `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`;
const activeKey = ref([]);
const formState = ref({
    fullname: user.value.fullname,
    email: user.value.email,
    phone: user.value.phone,
    inviteCode: user.value.inviteCode
})
const store = useStore();
const cskh = computed(() => {
    return store.state.cskh;
});




onMounted(() => {
    socket.on(`update-balance-${user.value._id}`, (data) => {
        formattedBalanceUser.value = formatCurrency(data.balance);
    });
    axios.get('/me/profile').then((res) => {
        user.value = res.user;
        formState.value.email = res.user.email;
        formState.value.phone = res.user.phone;
        formState.value.fullname = res.user.fullname;
        formState.value.inviteCode = res.user.inviteCode;

    }).catch((err) => {
        console.log(err);
        router.push('/login');
    });
})
watch(user, (newVal) => {
    formattedBalanceUser.value = formatCurrency(newVal.balance);
    formattedBetTodayUser.value = formatCurrency(newVal.betToday);
})
const updateInfo = (field, value) => {
    axios.put('/me/profile', {
        [field]: value
    }).then((res) => {
        user.value = res.user;
        layer.msg('Cập nhật thông tin thành công', {
            icon: 1,
            time: 2000
        });
    }).catch((err) => {
        console.log(err);
        layer.msg('Cập nhật thông tin thất bại', {
            icon: 2,
            time: 2000
        });
    });
}
</script>

<template>
    <div id="profile">
        <div class="info">
            <a-space align="center" style="display: flex; justify-content: space-around;">
                <HomeOutlined style="color: #000; font-size: 25px; display: block;" @click="router.push('/')" />
                <a-avatar :size="64" :src="staticUrl + user.avatar" :alt="user.username"></a-avatar>
                <a-typography.Title style="color: #000; font-size: 18px;" class="notranslate ">{{ user.id2}}</a-typography.Title>
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

        <div class="action_money">
            <a-space style="width: 100%; display: flex; justify-content: space-around;">
                <a-button type="primary" @click="openLink(cskh?.url)">
                    <a-space>
                        <img :src="iconDeposit" alt=""></img>
                        <span>Nạp tiền</span>
                    </a-space>
                </a-button>
                <a-button class="width_draw" @click="router.push('/withdraw')">
                    <a-space>
                        <img :src="iconDeposit" alt=""></img>
                        <span>Rút tiền</span>
                    </a-space>
                </a-button>
            </a-space>
        </div>

        <a-divider style="height: 1px; background-color: #ccc; margin: 0 10px"></a-divider>

        <div class="navigation">
            <h3 style="color: #000;">Thông tin cá nhân</h3>
            <a-collapse v-model:activeKey="activeKey" accordion>
                <a-collapse-panel key="1" header="Tài khoản">
                    <p>{{ user.username }}</p>
                </a-collapse-panel>
                <a-collapse-panel key="2" header="Ngân hàng liên kết" :disabled="false">
                    <p>
                        <router-link to="/link-bank">Ngân hàng liên kết</router-link>
                    </p>
                </a-collapse-panel>
                <a-collapse-panel key="3" header="Email">
                    <p>Liên kết email</p>
                    <a-input v-model:value="formState.email" />
                    <a-button type="primary" @click="updateInfo('email', formState.email)"
                        style="width: 100%; margin: 10px 0;">Cập
                        nhật</a-button>
                </a-collapse-panel>
                <!-- // số điệ thoại -->
                <a-collapse-panel key="4" header="Số điện thoại">
                    <p>Liên kết số điện thoại</p>
                    <a-input v-model:value="formState.phone" />
                    <a-button type="primary" @click="updateInfo('phone', formState.phone)"
                        style="width: 100%; margin: 10px 0;">Cập
                        nhật</a-button>
                </a-collapse-panel>
                <!-- // fullname -->
                <a-collapse-panel key="5" header="Họ và tên">
                    <p>Họ và tên</p>
                    <a-input v-model:value="formState.fullname" />
                    <a-button type="primary" @click="updateInfo('fullname', formState.fullname)"
                        style="width: 100%; margin: 10px 0;">Cập
                        nhật</a-button>
                </a-collapse-panel>
                <a-collapse-panel key="6" header="Mã giới thiệu">
                    <p>Mã giới thiệu</p>
                    <a-input v-model:value="formState.inviteCode" />
                    <a-button type="primary" @click="updateInfo('inviteCode', formState.inviteCode)"
                        style="width: 100%; margin: 10px 0;">Cập nhật</a-button>
                </a-collapse-panel>
            </a-collapse>
        </div>

    </div>
</template>

<style>
.navigation {
    padding: 15px;
}

.action_money {
    padding: 10px;
    background-color: rgb(245 167 173);
    margin: 10px;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
}

#profile {
    background-color: rgb(255 216 219 / 1);
    min-height: 100vh;
}

.width_draw {
    width: 100%;
    background-image: linear-gradient(124deg, #efdaaf, #dbb579);
}

.info_description {
    padding: 10px;
    background-color: rgb(245 167 173);
    min-height: 100px;
    margin: 10px;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 0;
}

.info {
    padding-top: 20px;
    padding-left: 20px;
}

.ant-table {
    background-color: rgb(245 167 173) !important;
    color: #000 !important;
}

.ant-table-row:hover .ant-table-cell {
    background-color: rgb(245 167 173) !important;
}

.ant-table-cell {
    color: #000 !important;
    background-color: rgb(255 216 219 / 1) !important;
}

.ant-pagination-total-text {
    color: #000 !important;
}

.ant-pagination-item-link {
    color: #000 !important;
}

.ant-pagination-item {
    background-color: #000 !important;
    color: rgb(255 216 219 / 1);
}

.ant-pagination-options-quick-jumper {
    color: #000 !important;
}

.ant-collapse-content-box p {
    color: #000 !important;
}

.ant-collapse-header {
    color: #000 !important;
}

.ant-collapse-content-box {
    background-color: rgb(255 216 219 / 1) !important;
}
</style>