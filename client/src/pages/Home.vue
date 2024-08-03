<script setup>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import slider1 from '@/assets/images/slider/1.webp'
import slider2 from '@/assets/images/slider/2.png'
import slider3 from '@/assets/images/slider/3.jpg'
import slider4 from '@/assets/images/slider/4.webp'
import iconDeposit from '@/assets/images/icons/deposit.png'
import iconWithdraw from '@/assets/images/icons/withdraw.png'
import iconAccount from '@/assets/images/icons/account.png'
import { HistoryOutlined, HomeOutlined as HomeOutlinedIcon, MessageOutlined, UserOutlined,  } from '@ant-design/icons-vue'

import sliderFooter from '@/assets/images/slider/footer.png'
import iconHome from '@/assets/images/icons/home.png'
import iconLottery from '@/assets/images/icons/lottery.svg'
import iconHistoryBet from '@/assets/images/icons/historyBet.png'
import iconCSKH from '@/assets/images/icons/cskh.svg'
import iconProfile from '@/assets/images/icons/profile.png'
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/common/axios'
import { layer } from "@layui/layer-vue"
import { useStore } from 'vuex'

import { getStorage, formatCurrency, baotri, openLink } from '@/common'
import { listGame } from '../common/constants'
import Header from '../components/Header.vue'

import {socket} from '@/socket'
const slider = [
    {
        id: 1,
        title: 'Slide 1',
        description: 'Description 1',
        image: slider1
    },
    {
        id: 2,
        title: 'Slide 2',
        description: 'Description 2',
        image: slider2
    },
    {
        id: 3,
        title: 'Slide 3',
        description: 'Description 3',
        image: slider3
    },
    {
        id: 4,
        title: 'Slide 4',
        description: 'Description 4',
        image: slider4
    },
];

const store = useStore()
const user = ref(getStorage('user'));

const urlCskh = computed(() => {
    return store.state.cskh;
});

const router = useRouter();
const formattedBalanceUser = ref(formatCurrency(user?.value?.balance));

onMounted(() => {
    socket.on(`update-balance-${user.value._id}`, (data) => {
        formattedBalanceUser.value = formatCurrency(data.balance);
    })

    axios.get('/me/profile').then(res => {
        user.value = res.user;
        formattedBalanceUser.value = formatCurrency(user.value.balance);
    }).catch(err => {
        console.log(err);
    })
})


</script>

<template>
    <div class="home">
        <Header title="Trang chủ" />

        <div class="slider">
            <carousel :items-to-show="1" :autoplay="1500" :wrap-around="true">
                <slide v-for="slide in slider" :key="slide">
                    <div class="carousel__item">
                        <img :src="slide.image" style="max-width: 100%;" />
                    </div>
                </slide>

                <template #addons>
                    <navigation />
                    <pagination />
                </template>
            </carousel>
        </div>
        <div class="main">
            <div class="navigation">
                <a-space align="center" style="justify-content: space-between;display: flex;">
                    <a-space direction="vertical">
                        <a-typography-text>
                            Chào mừng, <b class="notranslate ">{{ user.username }}</b>
                        </a-typography-text>
                        <!-- <a-typography-text>
                            Số dư, <span style="font-size: 20px;" class="notranslate ">{{
                                formattedBalanceUser }}</span>
                        </a-typography-text> -->
                    </a-space>
                    <a-space align="center" size="large">
                        <!-- <a-space align="center" direction="vertical" @click="openLink(urlCskh?.url)">
                            <img :src="iconDeposit" alt="" style="width: 30px">
                            <a-typography-text style="display: block; text-align: center; font-size: 10px;">
                                Nạp tiền
                            </a-typography-text>
                        </a-space>
                        <a-space align="center" direction="vertical" @click="router.push('/withdraw')">
                            <img :src="iconWithdraw" alt="" style="width: 30px">
                            <a-typography-text style="display: block; text-align: center; font-size: 10px;">
                                Rút tiền
                            </a-typography-text>
                        </a-space>
                        <a-space align="center" direction="vertical" @click="router.push('/profile')">
                            <img :src="iconAccount" alt="" style="width: 30px">
                            <a-typography-text style="display: block; text-align: center; font-size: 10px;">
                                Tài khoản
                            </a-typography-text>
                        </a-space> -->
                        <a-typography-text>
                            Số dư, <span style="font-size: 20px;" class="notranslate ">{{
                                formattedBalanceUser }}</span>
                        </a-typography-text>
                    </a-space>
                </a-space>
            </div>
            <div class="list_game" style="margin-top: 10px;">
                <!-- <a-space :size="[0, 0]" style="width: 100%;" class="list_game_item" wrap>
                    <div class="bg_game" v-for="game in listGame" :key="game.code"
                        @click="router.push(`/game/${game.code}`)">
                        <a-typography-text style="color: #000; font-size: 14px; display: block; height: 30px;">
                            {{ game.type }}
                        </a-typography-text>
                        <a-typography-text style="color: #000; font-size: 10px; display: block; height: 30px;">
                            {{ game.name }}
                        </a-typography-text>
                        <img :src="game.image" alt="" style="width: 50px;">
                    </div>

                </a-space> -->
                <a-row gutter="10" style="margin-bottom: 15px;">
                    <a-col :span="24" v-for="game in listGame" :key="game.code">
                        <div class="bg_game" @click="router.push(`/game/${game.code}`)">
                            <!-- <a-typography-text style="color: #000; font-size: 14px; display: block; height: 30px;">
                                {{ game.type }}
                            </a-typography-text>
                            <a-typography-text style="color: #000; font-size: 10px; display: block; height: 30px;">
                                {{ game.name }}
                            </a-typography-text> -->
                            <img :src="game.image" alt="" style="width: 100%;">
                        </div>
                    </a-col>
                </a-row>
            </div>

            <div class="slider-footer">
                <img :src="sliderFooter" alt="" style="max-width: 200px;">
            </div>
        </div>
        <div class="footer">
            <a-space align="center" style="justify-content: space-between; display: flex; cursor: pointer;">
                <a-space direction="vertical" @click="router.push('/')" style="cursor: pointer; gap: 5px">
                    <!-- <img :src="iconHome" alt="" style="width: 20px;"> -->
                    <HomeOutlinedIcon style="font-size: 16px; font-weight: 900;" />
                    <a-typography-text style="font-size: 16px; display: block;">
                        Trang chủ
                    </a-typography-text>
                </a-space>
                <a-space direction="vertical" @click="router.push('/trend')"
                    style="cursor: pointer; gap: 5px">
                    <!-- <img :src="iconHistoryBet" alt="" style="width: 20px;"> -->
                    <HistoryOutlined style="font-size: 16px;" />
                    <a-typography-text style="font-size: 16px; display: block;">
                        Xu hướng
                    </a-typography-text>
                </a-space>
                <!-- <a-space direction="vertical" @click="baotri">
                    <img :src="iconLottery" alt="" style="max-width: 20px;">
                    <a-typography-text style="color: #000; font-size: 14px; display: block;">
                        Sảnh xổ số
                    </a-typography-text>
                </a-space> -->
                <a-space direction="vertical" @click="openLink(urlCskh?.url)" style="cursor: pointer; gap: 5px">
                    <MessageOutlined style="font-size: 16px;" />
                    <a-typography-text style="font-size: 16px; display: block;">
                        CSKH
                    </a-typography-text>
                </a-space>
                <a-space direction="vertical" @click="router.push('/profile')" style="cursor: pointer; gap: 5px">
                    <UserOutlined style="font-size: 16px;" />
                    <a-typography-text style=" font-size: 16px; display: block;">
                        Cá nhân
                    </a-typography-text>
                </a-space>
            </a-space>
        </div>
    </div>
</template>

<style>
.footer {
    background-color: rgb(245 183 188);
    padding: 10px 10px;
    text-align: center;
    /* position: fixed; */
    bottom: 0;
    max-width: 576px;
    width: -webkit-fill-available;
    position: fixed;
    /* margin-top: 10px */

}

.home {
    background-color: #fff;
    min-height: 100vh;
}

.slider-footer {
    margin: 20px 0;
    margin-bottom: 100px;
    text-align: center
}

.main {
    padding: 10px;
    margin-top: 15px;
}

.list_game_item .ant-space-item {
    width: 25%;
    min-height: 100px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

}
.slider {
    background-color: rgb(255 216 219 / 1);
}

.bg_game {
    min-height: 100px;
    /* background-color: rgb(245 179 184); */
    background-size: cover;
    background-position: center;
    width: 100%;
    text-align: center;
    padding: 10px;
    cursor: pointer;
}

.bg_game:hover {
    opacity: 0.5;
}

.carousel__item {
    min-height: 200px;
    width: 100%;
    background-color: var(--vc-clr-primary);
    color: var(--vc-clr-white);
    font-size: 20px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.carousel__slide {
    padding: 10px;
}

.carousel__prev,
.carousel__next {
    box-sizing: content-box;
    color: #000f
}

.carousel__pagination-button::after {
    background-color: white;
}

.carousel__viewport {
    max-height: 240px;
}
.navigation{
    padding: 0 15px;

    /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
}
</style>