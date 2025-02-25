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
import { useStore } from 'vuex';
import {socket} from '@/socket'

const user = ref(getStorage('user'))
const staticUrl = import.meta.env.VITE_APP_STATIC_URL ?? 'http://localhost:3000'
const formattedBalanceUser = ref(formatCurrency(user.balance))
const formattedBetTodayUser = ref(formatCurrency(user.betToday))
const router = useRouter();
const query = router.currentRoute.value.query;
console.log(query);

const dataSource = ref([]);
const store = useStore();
const cskh = computed(() => {
    return store.state.cskh;
});


const columns = [
    {
        title: 'Phiên',
        dataIndex: 'sessionId',
        key: 'sessionId',
    },
    {
        title: 'Số đặt cược',
        dataIndex: 'betInUserText',
        key: 'betInUserText',
    },
    {
        title: 'Số tiền cược',
        dataIndex: 'amount',
        key: 'betDataText',
    },
    //resultSession
    {
        title: 'Kết quả',
        dataIndex: 'resultSession',
        key: 'resultSession',
    },
    {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        key: 'createdAt',
        customRender: (text) => {
            return formatDateTime(text.text)
        }
    },

]
const pagination = ref(
    {
        pageSize: 10,
        showSizeChanger: false,
        showQuickJumper: false,
        showTotal: (total) => `Total ${total} items`,
    }
)

const updateData = (data) => {
    const valueToMessage = {
        1: "IN",
        2: "OUT",
        3: "DOWN",
        4: "UP"
    };

    return data.map((item) => {
        const idToMessage = ["số đầu tiên", "số thứ hai", "số thứ ba", "số thứ tư", "số thứ năm"];

        // Tạo message cho từng betInUser
        const messages = item.betInUser.map((bet, index) => {
            const idMessage = idToMessage[index] || `số thứ ${index + 1}`;
            const valueMessage = valueToMessage[bet.value] || `value ${bet.value}`;
            return `${idMessage}: ${valueMessage}`;
        });

        // Ghép các message lại với nhau
        const finalMessage = messages.join(" - ");

        // Trả về đối tượng mới với các trường đã cập nhật
        return {
            ...item,
            sessionId: item.betData?.id,
            resultSession: item.betData.betData.join(','),
            betInUserText: finalMessage,
            createAt: formatDateTime(item.createdAt),
            amount: formatCurrency(item.amount)

        };
    });
};
const pageSize = ref(20);
const current1 = ref(3);
const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
};
watch(pageSize, () => {
    console.log('pageSize', pageSize.value);
});
watch(current1, () => {
    console.log('current', current1.value);
});


onMounted(() => {
    socket.on(`update-balance-${user.value._id}`, (data) => {
        formattedBalanceUser.value = formatCurrency(data.balance);
    })
    axios.get('/me/profile').then((res) => {
        user.value = res.user;
    }).catch((err) => {
        console.log(err);
        router.push('/login');
    });
    axios.get(`/me/historybet/${user.value?._id}`).then((res) => {
        const data = updateData(res.docs);
        dataSource.value = cloneDeep(data);
        console.log(res);
        pagination.value = {
            ...pagination.value,
            total: res.totalDocs + 1,
            pageSize: res.limit,
            current: res.page,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `Tổng kết qủa ${res.totalDocs} kết quả`,
        }
    }).catch((err) => {
        console.log(err);
    });
})
const run = async (params = {}) => {
    const data = {
        ...params,
    }
    const res = await axios.get(`/me/historybet/${user.value?._id}`, { params: data });
    const dataUpdate = updateData(res.docs);
    dataSource.value = cloneDeep(dataUpdate);
    pagination.value = {
        ...pagination.value,
        total: res.totalDocs + 1,
        pageSize: res.limit,
        current: res.page,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `Tổng kết qủa ${res.totalDocs} kết quả`,
    }
}
const handleTableChange = (pag, filters, sorter) => {
    run({
        results: pag.pageSize,
        page: pag?.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
    });
};
watch(user, (newVal) => {
    formattedBalanceUser.value = formatCurrency(newVal.balance);
    formattedBetTodayUser.value = formatCurrency(newVal.betToday);
})
const changePagination = (page) => {
    run({
        page: page,
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
            <!-- <h3 style="color: #000;">Lịch sử đặt cược</h3> -->
            <!-- <a-table :columns="columns" @change="handleTableChange" :dataSource="dataSource" bordered :hover="false"
                resizeColumn :pagination="pagination"></a-table> -->
            <div class="result" v-for="data in dataSource" v-if="dataSource.length">
                <p>Phiên Id: {{ data.betData.id }}</p>
                <p>Số đánh: {{ data.betInUserText }}</p>
                <p>Số tiền cược: {{ formatCurrency(data.amount) }}</p>
                <p>
                    <a-row gutter="10" style="justify-content: center; align-items: center; align-self: center;">
                        Kết quả:
                        <a-col :span="4" v-for="betN in data.betData.betData" :key="betN">
                            <a-typography-text class="result_item2"
                                style="color: #000; font-size: 16px; display: block; text-align: center;">
                                {{ betN }}
                            </a-typography-text>
                        </a-col>
                    </a-row>
                </p>
                <p>Thời gian: {{ formatDateTime(data.betData.timeEnd) }}</p>
                <p>Số tiền thắng cược:
                    <span style="color: red" v-if="data.interest <= 0">{{ formatCurrency(data.interest) }}</span>
                    <span style="color: green" v-else>{{ formatCurrency(data.interest) }}</span>
                </p>
            </div>
            <div v-else style="color: #000; text-align: center;">Không có kết quả</div>
            <div class="pagination" v-if="dataSource.length">
                <a-pagination show-size-changer v-model:current="pagination.current"
                    v-model:pageSize="pagination.pageSize" :total="pagination.total" @change="changePagination" />
            </div>
        </div>

    </div>
</template>

<style>
.navigation {
    padding: 15px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
}

.result_item2 {
    width: 30px;
    height: 30px;
    background-image: linear-gradient(179deg, #13a2ba, #087c95);
    /* margin: 5px; */
    border-radius: 100%;

}

.result {
    padding: 10px;
    background-color: rgb(245 167 173);
    margin: 10px;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    /* text-align: center; */
    color: #000;

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
</style>