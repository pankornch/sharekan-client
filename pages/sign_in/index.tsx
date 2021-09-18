import React, { FC, useRef, useState } from "react"
import { getSession, session, signIn, useSession } from "next-auth/client"
import Link from "next/link"
import { useRouter } from "next/dist/client/router"
import Alert from "@/src/components/Alert"
import { useRecoilState } from "recoil"
import { userState } from "@/src/store"
import { GET_ME } from "@/src/gql"
import { GetServerSideProps } from "next"
import client from "@/src/configs/apollo-client"

const SignIn: FC = () => {
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")

	const router = useRouter()

	const alertRef = useRef<any>()

	const [_, setUser] = useRecoilState(userState)

	const onSubmit = async (e: any) => {
		e.preventDefault()

		try {
			const res = await signIn("credentials", {
				email,
				password,
				redirect: false,
			})

			if (!res?.ok) {
				alertRef.current?.open({
					title: "เข้าสู่ระบบไม่สำเร็จ",
					body: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
				})
				return
			}

			const me = await client.query({ query: GET_ME })

			setUser(me.data.me)

			await alertRef.current?.open({
				title: "เข้าสู่ระบบสำเร็จ",
				type: "SUCCESS",
			})

			router.push("/dashboard")
		} catch (error: any) {
			alertRef.current?.open({
				title: "เข้าสู่ระบบไม่สำเร็จสำเร็จ",
				body: error.message,
				type: "ERRROR",
			})
		}
	}

	return (
		<div className="container items-center">
			<div className="flex flex-col space-y-3 h-60 items-center justify-center">
				<img src="/logo.svg" alt="" className="w-32" />
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

				<button className="button text-white bg-main-blue" type="submit">
					เข้าสู่ระบบ
				</button>

				<Link href="/sign_up">
					<a className="button">ยังไม่มีบัญชี ?</a>
				</Link>

				<Alert ref={alertRef} />
			</form>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const session = await getSession({ req })

	if (session) {
		res.writeHead(302, {
			Location: "/dashboard",
		})
		res.end()
	}

	return {
		props: {},
	}
}

export default SignIn
