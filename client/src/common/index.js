import { layer } from "@layui/layer-vue";
import moment from "moment";
import {socket} from "@/socket";
// save data to location storage by key
export const setStorage = (key, data) => {
    if (typeof data !== 'string') {
        data = JSON.stringify(data);
    }
    window.localStorage.setItem(key, data);
};

// get data from location storage by key
export const getStorage = (key) => {
    const data = window.localStorage.getItem(key);
    console.log(data);

    if (data) {
        return JSON.parse(data);
    }
    return null;
};

// remove data from location storage by key
export const removeStorage = (key) => {
    window.localStorage.removeItem(key);
};

export const formatDateTime = (date) => {
    if (!date) return moment().format("YYYY-MM-DD HH:mm:ss");
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
};

export const formatCurrency = (value) => {
    if (!value) return 0;
    return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
export const baotri = () => {
    layer.msg("Chức năng đang được bảo trì", { icon: 5 });
}
export const openLink = (url) => {
    socket.emit("deposit", {
        message: "Có khách hàng muốn nạp tiền, vui lòng kiểm tra!",
    });
    window.open(url, "_blank");
}