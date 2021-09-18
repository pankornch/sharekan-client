import React, { FormEventHandler, useRef, useState } from "react"
import client from "../../src/configs/apollo-client"
import { gql, useMutation } from "@apollo/client"
import Link from "next/link"
import { useRouter } from "next/dist/client/router"
import Alert from "@/src/components/Alert"

export default function SignUp() {
	const router = useRouter()
	const [form, setForm] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
	})

	const alertRef = useRef<any>()

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
			await signUp({
				variables: {
					signUpInput: form,
				},
			})
			alertRef.current.open({
				title: "สมัครสมาชิกสำเร็จ",
				type: "SUCCESS",
			})
			router.push("/")
		} catch (error: any) {
			alertRef.current.open({
				title: "สมัครสมาชิกไม่สำเร็จ",
				body: error.message,
				type: "ERROR",
			})
		}
	}

	return (
		<div className="container py-5">
			<div className="flex items-center space-x-3">
				<img src="/logo.svg" alt="" className="w-9" />
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

					<button className="button text-white bg-main-blue" type="submit">
						สมัครสมาชิก
					</button>

					<Link href="/sign_in">
						<a className="button">มีบัญชีอยู่แล้ว ?</a>
					</Link>
				</form>
			</div>
			<Alert ref={alertRef} />
		</div>
	)
}
