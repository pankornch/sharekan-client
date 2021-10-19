import React, { useState } from "react"
import { gql, useMutation } from "@apollo/client"
import Link from "next/link"
import { useRouter } from "next/dist/client/router"
import Loading from "@/public/loading.svg"
import Toast from "@/src/components/Toast"
import LogoSVG from "@/public/logo.svg"

export default function SignUp() {
	const router = useRouter()
	const [form, setForm] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
	})

	const [loading, setLoading] = useState<boolean>(false)

	const [signUp] = useMutation(gql`
		mutation ($signUpInput: SignUpInput!) {
			signUp(input: $signUpInput) {
				token
			}
		}
	`)

	const onSubmit = async (e: any) => {
		e.preventDefault()
		try {
			setLoading(true)
			await signUp({
				variables: {
					signUpInput: form,
				},
			})
			Toast.open({
				title: "สมัครสมาชิกสำเร็จ",
				type: "SUCCESS",
			})
			router.push("/")
		} catch (error: any) {
			setLoading(false)
			Toast.open({
				title: "สมัครสมาชิกไม่สำเร็จ",
				content: error.message,
				type: "ERROR",
			})
		}
	}

	return (
		<div className="container py-5">
			<div className="flex items-center space-x-3">
				<LogoSVG className="w-9" />
				<h4 className="text-xl">Sharekan</h4>
			</div>
			<div className="flex flex-col space-y-5">
				<h3 className="text-2xl text-center my-5">สร้างบัญชี</h3>
				<form onSubmit={onSubmit} className="flex flex-col space-y-5 w-full">
					<input
						className="input"
						type="text"
						placeholder="อีเมล"
						value={form.email}
						onChange={(e) =>
							setForm((prev) => ({ ...prev, email: e.target.value }))
						}
					/>

					<input
						className="input"
						type="text"
						placeholder="ชื่อ"
						value={form.name}
						onChange={(e) =>
							setForm((prev) => ({ ...prev, name: e.target.value }))
						}
					/>

					<input
						className="input"
						type="password"
						placeholder="รหัสผ่าน"
						value={form.password}
						onChange={(e) =>
							setForm((prev) => ({ ...prev, password: e.target.value }))
						}
					/>

					<input
						className="input"
						type="password"
						placeholder="ยืนรหัสผ่าน"
						value={form.confirmPassword}
						onChange={(e) =>
							setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
						}
					/>

					<button
						className="button text-white bg-main-blue"
						type="submit"
						disabled={loading}
					>
						{loading && (
							<Loading className="text-gray-500 w-5 h-5 mr-3 animate-spin" />
						)}
						สมัครสมาชิก
					</button>

					<Link href="/sign_in">
						<a className="button">มีบัญชีอยู่แล้ว ?</a>
					</Link>
				</form>
			</div>
		</div>
	)
}
