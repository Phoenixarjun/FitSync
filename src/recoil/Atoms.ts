// recoil/Atoms.ts
import { atom } from "recoil";

export const UserState = atom({
  key: "userState", // unique ID for this atom
  default: {
    isVerified: false,
    loading: false,
  },
});
