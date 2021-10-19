import React, { FC, useEffect } from "react"
import Link from "next/link"
import { getSession } from "next-auth/client"
import { useRecoilState } from "recoil"
import { userState } from "../store"
import isEmpty from "../utils/isEmpty"
const Navbar: FC = () => {
	const [user, setUser] = useRecoilState(userState)
	useEffect(() => {
		if (isEmpty(user)) {
			getSession().then((session) => {
				if (session) {
					setUser(session!.user)
				}
			})
		}
	}, [setUser, user])
	return (
		<div className="flex items-center justify-between container pt-5">
			<div className="flex space-x-5 items-center">
				<img src="/logo.svg" alt="" className="w-9" />
				<h3 className="text-2xl font-bold">Sharekan</h3>
			</div>
			{isEmpty(user) ? (
				<Link href="/sign_in">
					<a className="bg-main-orange rounded-lg text-white px-2 py-1 cursor-pointer hover:bg-yellow-500">
						Sign In
					</a>
				</Link>
			) : (
				<Link href="/dashboard">
					<a className="bg-main-orange rounded-lg text-white px-2 py-1 cursor-pointer hover:bg-yellow-500">
						Dashboard
					</a>
				</Link>
			)}
		</div>
	)
}

export default Navbar
