import {authClient} from "@/lib/api/client";

export const requestPoint = async (s:string, point:number) => {

    const {data} = await authClient().post("/post/pay", {
        "yagunJu":s,
        "amount":point,
    });
    return data;
}

export const getPayUsers = async ()=>{
    const {data} = await authClient().get("/get/pay");
    return data;
}
export const payPoint = async () => {
    const {data} = await authClient().post("/post/paydata");
    return data;
}