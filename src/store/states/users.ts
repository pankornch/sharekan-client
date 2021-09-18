import { IUser } from "@/src/types"
import { atom } from "recoil"

export const userState = atom<IUser>({
	key: "userState",
	default: {},
})
