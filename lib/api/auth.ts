import axios from "axios";
import { authClient, userEmailAuth, client } from "./client";

export const getEmailAuthCode = async (targetEmail: string) => {
    const {data} = await userEmailAuth().post("/api/get/email", {
        email: targetEmail,
    }, {
        responseType: "json",
    })
    return data;
}
export const verifyEmailAuthCode = async (targetEmail: string, authCode: string, username:string, password:string, phoneNumber:string) => {
    const {data} = await userEmailAuth().post("/api/post/valid", {
        targetEmail: targetEmail,
        authCode: authCode,
        username:username,
        password:password,
        phoneNumber:phoneNumber
    }, {
        responseType: "json",
    })
    return data;
}
export const login = async (userId: string, password: string) => {
    let a = await client.post(
        "/authenticate",
        {
            username: userId,
            password: password,
        },
        {
            responseType:"text"
        }
    );
    console.log(userId, password, a)
    if (a.status != 403) {
        localStorage.setItem("token", a.data);
        return true;
    } else {
        return false;
    }
};

export const logout = async () => {
    localStorage.removeItem("token");
};

export const register = async ({
                                   name,
                                   password,
                                   phoneNumber,
                               }: {
    name: string;
    password: string;
    phoneNumber: string;
}) => {
    const res = await client.post(`/api/user/post`, {
        username: name,
        password: password,
        phoneNumber: phoneNumber
    });
    return res.status;
};
