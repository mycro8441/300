import {authClient} from "@/lib/api/client";

export const requestPoint = async (s:string) => {
    const {data} = await authClient().post("/post/pay", {
        "yagunJu":s
    });
    return data;
}

export const getPayUsers = async ()=>{
    const {data} = await authClient().get("/get/pay");
    return data;
}