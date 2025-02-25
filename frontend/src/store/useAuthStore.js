import { create } from "zustand";

export const useAuthStore = create((set) => ({
  //initialState
  authUser: null, //no user initially
  isCheckingAuth: true, //checking as soon as the page refreshes
})); //first arg=> callback function which returns an object
