import DashboardNavbar from "@/src/components/DashboardNavbar"
import auth from "@/src/middlewares/auth"
import { IUser } from "@/src/types"
import { getSession } from "next-auth/client"
import React, { FC, useEffect, useState } from "react"
import { signOut } from "next-auth/client"
import Section from "@/src/components/Section"
import Link from "next/link"
import client from "@/src/configs/apollo-client"
import gql from "graphql-tag"
import { useRouter } from "next/dist/client/router"
import { useQuery } from "@apollo/client"
import { GET_ME } from "@/src/gql"
import { userState } from "@/src/store"
import { useRecoilState } from "recoil"
import Loading from "@/src/components/Loading"

interface Props {
	user: IUser
}

const Profle: FC<Props> = (props) => {
	const router = useRouter()

	const { data: queryMe } = useQuery(GET_ME)

	const [user, setUser] = useState<IUser>({})
	const [loading, setLoading] = useState<boolean>(true)
	const [_, setUserStore] = useRecoilState(userState)

	const onSignOut = () => {
		signOut({ callbackUrl: "http://localhost:3000" })
		setUserStore({});
	}
	useEffect(() => {
		if (!queryMe) return
		setUser(queryMe.me)
		setLoading(false)
	}, [queryMe])

	const onSubmit = async () => {
		await client.mutate({
			mutation: gql`
				mutation ($updateProfileInput: UpdateProfileInput!) {
					updateProfile(input: $updateProfileInput) {
						name
					}
				}
			`,
			variables: {
				updateProfileInput: {
					name: user.name,
					promptpayName: user.promptpayName,
					promptpayNumber: user.promptpayNumber,
				},
			},
		})

		router.back()
	}

	if (loading) return <Loading />

	return (
		<div>
			<DashboardNavbar backButton title="Profile" backTo="/dashboard" />

			<div className="pt-24 pb-14 container h-screen flex flex-col justify-between">
				<div className="space-y-5">
					<div>
						<Section title="อีเมล">
							<input
								type="text"
								className="input w-full"
								readOnly
								disabled
								defaultValue={props.user.email}
							/>
						</Section>
					</div>

					<Section title="ชื่อ">
						<input
							type="text"
							className="input w-full"
							value={user.name}
							onChange={(e) =>
								setUser((prev) => ({ ...prev, name: e.target.value }))
							}
						/>
					</Section>

					<Section title="ชื่อพร้อมเพย์">
						<input
							type="text"
							className="input w-full"
							value={user.promptpayName || ""}
							onChange={(e) =>
								setUser((prev) => ({ ...prev, promptpayName: e.target.value }))
							}
						/>
					</Section>

					<Section title="เบอร์พร้อมเพย์">
						<input
							type="text"
							className="input w-full"
							value={user.promptpayNumber || ""}
							onChange={(e) =>
								setUser((prev) => ({
									...prev,
									promptpayNumber: e.target.value,
								}))
							}
						/>
					</Section>
				</div>

				<div className="space-y-5">
					<div className="button bg-main-blue text-white" onClick={onSubmit}>
						บันทึก
					</div>

					<Link href="/profile/change_password">
						<a className="button bg-main-orange text-white ">เปลี่ยนรหัสผ่าน</a>
					</Link>

					<div className="button bg-main-red text-white" onClick={onSignOut}>
						ออกจากระบบ
					</div>
				</div>
			</div>
		</div>
	)
}

export const getServerSideProps = auth(async ({ req }: any) => {
	const session = await getSession({ req })
	return {
		props: {
			user: session?.user,
		},
	}
})

export default Profle
