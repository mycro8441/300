import {create} from 'zustand'
interface serviceI {
    themeMode:"light"|"dark";
    setThemeMode: (value:"light"|"dark") => void;
    toggleTheme:()=>void;
}
const useStore = create<serviceI>(set=>({
    themeMode:'light',
    setThemeMode:(value:"light"|"dark")=>set(()=>({themeMode:value})),
    toggleTheme: () => set(state=>({themeMode:state.themeMode === "light" ? "dark" : "light"}))
}))

export default useStore;