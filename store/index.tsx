import {create} from 'zustand'
interface serviceI {
    themeMode:boolean;
    setThemeMode: (value:boolean) => void;
    toggleTheme:()=>void;
}
const useStore = create<serviceI>(set=>({
    themeMode:true,
    setThemeMode:(value:boolean)=>set(()=>({themeMode:!!value})),
    toggleTheme: () => set(state=>({themeMode:!state.themeMode}))
}))

export default useStore;