import React, { FC } from "react"
import Link from "next/link"
import { useSession } from "next-auth/client"
const Navbar: FC = () => {
	const [session] = useSession()
	return (
		<div className="flex items-center justify-between container pt-5">
			<div className="flex space-x-5 items-center">
				<img src="/logo.svg" alt="" className="w-9" />
				<h3 className="text-2xl font-bold">Sharekan</h3>
			</div>
			{!session ? (
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
