import React, { FC, useEffect } from "react"
import avatar from "@/src/utils/avatar"
import ArrowLeft from "../../public/arrow-left.svg"
import { useRouter } from "next/dist/client/router"
import { useRecoilState } from "recoil"
import { userState } from "../store"
import { useSession } from "next-auth/client"
import { IUser } from "../types"
import LoadingSVG from "@/public/loading.svg"

interface Props {
	backButton?: boolean
	title?: string
	backTo?: string
}

const DashboardNavbar: FC<Props> = (props) => {
	const router = useRouter()
	const [user, setUser] = useRecoilState(userState)
	const handleBack = () => {
		if (!props.backTo) {
			return router.back()
		}

		router.replace(props.backTo!)
	}

	const [session] = useSession()

	useEffect(() => {
		if (!session) return

		if (!Object.values(user).length) {
			setUser(session!.user as IUser)
		}
	}, [session, user, setUser])

	return (
		<div className="flex justify-between items-center bg-main-blue fixed w-full top-0 right-0 z-50 px-7 text-white">
			<>
				{props.backButton && (
					<div onClick={handleBack}>
						<ArrowLeft className="fill-current w-9 cursor-pointer" />
					</div>
				)}
			</>
			<h3 className="text-lg truncate px-5">{props.title && props.title}</h3>
			<div
				onClick={() => router.push("/profile")}
				className="rounded-circle py-3 cursor-pointer"
			>
				{!Object.keys(user).length ? (
					<LoadingSVG className="fill-current text-main-orange animate-spin w-5" />
				) : (
					<img src={avatar(user?.email)} className="w-12" alt="" />
				)}
			</div>
		</div>
	)
}

export default DashboardNavbar
