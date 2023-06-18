import {create} from 'zustand'

type User = {
    id:number;
    email:string;
    phoneNumber:string;
    role:string;
    encryptedPw:string;
    points:number;
    ban:boolean;
    usrPw:string;
}
interface serviceI {
    themeMode:boolean;
    setThemeMode: (value:boolean) => void;
    toggleTheme:()=>void;
    isLogined:boolean;
    setIsLogined: (value:boolean) => void;
    curPair:string;
    setCurPair: (value:string) => void;
    userInfo:User;
    setUserInfo:(info:User) => void;
}


const useStore = create<serviceI>(set=>({
    themeMode:true,
    isLogined:false,
    curPair:"BTCUSDT",
    setIsLogined:(value:boolean)=>set(()=>({isLogined:value})),
    setThemeMode:(value:boolean)=>set(()=>({themeMode:value})),
    setCurPair:(value:string)=>set(()=>({curPair:value})),
    toggleTheme: () => set(state=>({themeMode:!state.themeMode})),
    userInfo:{
        id:null,
        email:"",
        phoneNumber:"",
        role:"ROLE_USER",
        ban:false,
        usrPw:"",
        encryptedPw:"",
        points:0,
    },
    setUserInfo:(info:User)=>set(()=>({userInfo:info})),
}))

export default useStore;
