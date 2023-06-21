import {authClient, client} from "@/lib/api/client";

export const getSignal = async () => {
    const {data} = await client.get("/webhook/get/signal");
    return data;
}

export const getBottomSignal = async () => {
    const {data} = await authClient().get("/get/bottom-signal");
    return data;
}

export const getUserSignal = async() => { // 사용자가 구매한 시그널을 가져옴
    const {data} = await authClient().get("/get/user/signal");
    return data;
}