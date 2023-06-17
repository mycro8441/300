import {authClient, client} from "@/lib/api/client";

export const getSignal = async () => {
    const {data} = await client.get("/webhook/get/signal");
    return data;
}

export const getBottomSignal = async () => {
    const {data} = await authClient().get("/get/bottom-signal");
    return data;
}
