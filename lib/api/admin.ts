
import {authClient, client} from "@/lib/api/client";

export const getUserList = async () => {
    const {data} = await authClient().get("/get/user/all");
    return data;
}
export const banUser = async (email:string) => {
    const {data} = await authClient().post("/post/user/ban", {"target":email});
    return data;
}
export const setPoint = async(email:string, points:number) => {

    const {data} = await authClient().post("/post/admin/point", {
        target:email,
        point:points,
    });
    return data;
}

export const setSignalCost = async(amount:string) => {
    const {data} = await authClient().get("/pay/set/point?point="+amount);
    return data;
}