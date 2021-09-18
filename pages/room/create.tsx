import DashboardNavbar from "@/src/components/DashboardNavbar"
import { CREATE_ROOM } from "@/src/gql"
import auth from "@/src/middlewares/auth"
import { useMutation } from "@apollo/client"
import { useRouter } from "next/dist/client/router"
import React, { FC, useState } from "react"

const CreateRoom: FC = () => {
	const router = useRouter()
	const [title, setTitle] = useState<string>("")
	const [createRoom] = useMutation(CREATE_ROOM)

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const res = await createRoom({ variables: { createRoomInput: { title } } })
		const { id } = res.data.createRoom
		router.push(`/room/${id}`)
	}

	return (
		<div className="px-7">
			<DashboardNavbar backButton />
			<div className="flex flex-col items-center pt-24 space-y-14 container">
				<img src="/create-room.svg"  className="w-full lg:w-1/3"/>

				<form onSubmit={onSubmit} className="w-full">
					<label htmlFor="input">สร้างห้อง</label>
					<input
						className="input mt-3 w-full"
						onChange={(e) => setTitle(e.target.value)}
						value={title}
					/>
					<button
						type="submit"
						className="button bg-main-blue text-white mt-12 w-full"
					>
						สร้างห้อง
					</button>
				</form>
			</div>
		</div>
	)
}

export const getServerSideProps = auth(async () => {
	return {
		props: {},
	}
})

export default CreateRoom
