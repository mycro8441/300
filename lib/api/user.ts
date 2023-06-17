import {authClient} from "@/lib/api/client";

export const getUserInfo = async () => {
    const {data} = await authClient().get("/get/userinfo");
    return data;
}
