import DashboardNavbar from "@/src/components/DashboardNavbar"
import Section from "@/src/components/Section"
import auth from "@/src/middlewares/auth"
import React, { FC, useState } from "react"
import { useMutation } from "@apollo/client"
import { CHANGE_PASSWORD } from "@/src/gql"
import { useRouter } from "next/dist/client/router"
import Toast from "@/src/components/Toast"

const ChangePassword: FC = () => {
	const router = useRouter()
	const [form, setForm] = useState({
		currentPassword: "",
		newPassword: "",
	})

	const [changePassword] = useMutation(CHANGE_PASSWORD)

	const onSubmit = async () => {
		try {
			await changePassword({
				variables: {
					changePasswordInput: form,
				},
			})

			Toast.open({
				title: "เปลี่ยนรหัสผ่านสำเร็จ",
				type: "SUCCESS",
			})

			router.back()
		} catch (error) {
			Toast.open({
				title: "เปลี่ยนรหัสผ่านไม่สำเร็จ",
				content: "รหัสผ่านเดิมไม่ถูกต้อง",
				type: "ERROR",
			})
		}
	}

	return (
		<div>
			<DashboardNavbar backButton title="เปลี่ยนรหัสผ่าน" backTo="/profile" />

			<div className="pt-24 pb-14 container h-screen flex flex-col justify-between">
				<div className="space-y-5">
					<Section title="รหัสผ่านเดิม">
						<input
							type="password"
							className="input w-full"
							value={form.currentPassword}
							onChange={(e) =>
								setForm((prev) => ({
									...prev,
									currentPassword: e.target.value,
								}))
							}
						/>
					</Section>

					<Section title="รหัสผ่านใหม่">
						<input
							type="password"
							className="input w-full"
							value={form.newPassword}
							onChange={(e) =>
								setForm((prev) => ({
									...prev,
									newPassword: e.target.value,
								}))
							}
						/>
					</Section>
				</div>
				<div
					onClick={onSubmit}
					className="button bg-main-blue text-white cursor-pointer"
				>
					บันทึก
				</div>
			</div>
		</div>
	)
}

export const getServerSideProps = auth(() => {
	return {
		props: {},
	}
})

export default ChangePassword
