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

export const buySignal = async(coin:string, mode:0|1|2|3) => {
    let tf;
    switch (mode) {
        case 0:
            tf = "5m"
        case 1:
            tf = "10m"
        case 2:
            tf = "30m"
        case 3:
            tf = "1h"
    }
    const {data} = await authClient().post("/post/pay/confirm", {
        targetCoinName:`${coin}.P`,
        timeFrame:tf
    });
    return data;
}

export const getBoughtSignal = async()=>{
    const {data} = await authClient().get("/get/pay/confirm")
    return data;
}