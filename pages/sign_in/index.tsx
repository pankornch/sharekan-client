import React, { FC, useEffect, useRef, useState } from "react"
import { getSession, signIn } from "next-auth/client"
import Link from "next/link"
import { useRouter } from "next/dist/client/router"
import { useRecoilState } from "recoil"
import { userState } from "@/src/store"
import { GET_ME } from "@/src/gql"
import client from "@/src/configs/apollo-client"
import LoadingSVG from "@/public/loading.svg"
import Loading from "@/src/components/Loading"
import Toast from "@/src/components/Toast"
import LogoSVG from "@/public/logo.svg"

const SignIn: FC = () => {
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [loadingSession, setLoadingSession] = useState<boolean>(true)
	const [loading, setLoading] = useState<boolean>(false)

	const router = useRouter()

	const [, setUser] = useRecoilState(userState)

	useEffect(() => {
		getSession().then((session) => {
			setLoadingSession(false)
			if (session) {
				router.replace("/dashboard")
			}
		})
	}, [])

	const onSubmit = async (e: any) => {
		e.preventDefault()

		try {
			setLoading(true)
			const res = await signIn("credentials", {
				email,
				password,
				redirect: false,
			})

			if (!res?.ok) {
				Toast.open({
					title: "เข้าสู่ระบบไม่สำเร็จ",
					content: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
					type: "ERROR",
				})
				return
			}

			const me = await client.query({ query: GET_ME })

			setUser(me.data.me)

			await Toast.open({
				title: "เข้าสู่ระบบสำเร็จ",
				type: "SUCCESS",
			})

			router.push("/dashboard")
		} catch (error: any) {
			setLoading(false)
			Toast.open({
				title: "เข้าสู่ระบบไม่สำเร็จสำเร็จ",
				content: error.message,
				type: "ERROR",
			})
		}
	}

	if (loadingSession) return <Loading />

	return (
		<div className="container items-center">
			<div className="flex flex-col space-y-3 h-60 items-center justify-center">
				<LogoSVG className="w-32" />
				<h3 className="text-xl font-bold text-dark">Sharekan</h3>
			</div>
			<form onSubmit={onSubmit} className="flex flex-col space-y-5 w-full">
				<input
					className="input"
					type="text"
					placeholder="อีเมล"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<input
					className="input"
					type="password"
					placeholder="รหัสผ่าน"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<div className="text-right text-main-grey text-sm">
					<Link href="/forget_password">ลืมรหัสผ่าน ?</Link>
				</div>

				<button
					className="button text-white bg-main-blue"
					type="submit"
					disabled={loading}
				>
					{loading && (
						<LoadingSVG className="text-gray-500 w-5 h-5 mr-3 animate-spin" />
					)}
					เข้าสู่ระบบ
				</button>

				<Link href="/sign_up">
					<a className="button">ยังไม่มีบัญชี ?</a>
				</Link>
			</form>
		</div>
	)
}

export default SignIn
