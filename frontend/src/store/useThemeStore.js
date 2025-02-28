// this will be used to store the theme in th elocal storage so that when we refresh the page the theme is still applied
import { create } from "zustand";

export const useThemeStore = create((set) => ({
  //   theme: "halloween",//by default
  theme: localStorage.getItem("chat-theme") || "halloween", //get from localStorage or the default one
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme); //localStorage updation
    set({ theme }); //global state updation
  },
}));
