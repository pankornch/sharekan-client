import DashboardNavbar from "@/src/components/DashboardNavbar"
import React, { FC } from "react"
import { QRCode } from "react-qr-svg"
import Copy from "@/src/components/Copy"
import avatar from "@/src/utils/avatar"
import Crown from "@/public/crown.svg"
import Bot from "@/public/bot.svg"
import User from "@/public/user.svg"
import Section from "@/src/components/Section"
import auth from "@/src/middlewares/auth"
import client from "@/src/configs/apollo-client"
import { IRoom } from "@/src/types"
import { getSession } from "next-auth/client"
import { GET_ROOM_OVERVIEW, REMOVE_ROOM } from "@/src/gql"
import { useRouter } from "next/dist/client/router"
import { useMutation } from "@apollo/client"

interface Props {
	query: {
		roomId: string
	}
	room: IRoom
	isOwner: boolean
}

const getInviteUri = (id: string) => {
	const host = process.env.NEXT_PUBLIC_HOST
	return `${host}/join_room?id=${id}`
}

const RoomOverview: FC<Props> = (props) => {
	const renderRoleIcon = (role: string) => {
		switch (role) {
			case "OWNER":
				return <Crown className="w-8" />
			case "BOT":
				return <Bot className="w-8" />
			case "MEMBER":
				return <User className="w-8" />
		}
	}

	const [removeRoom] = useMutation(REMOVE_ROOM)

	const router = useRouter()

	const onRemoveRoom = async () => {
		if (!confirm("ต้องการลบห้องนี้หรือไม่?")) return

		try {
			await removeRoom({
				variables: {
					removeRoomInput: {
						id: props.query.roomId,
					},
				},
			})
			router.replace("/dashboard")
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div>
			<DashboardNavbar backButton backTo={`/room/${props.query.roomId}`} />

			<div className="container pt-24 pb-9 space-y-7">
				<Section title="ชื่อห้อง">
					<input
						type="text"
						className="input w-full"
						defaultValue={props.room.title}
						readOnly
					/>
				</Section>

				<Section title="ไอดีห้อง">
					<input
						type="text"
						className="input w-full"
						defaultValue={props.room.id}
						readOnly
					/>
				</Section>

				<Section title="QR Code เชิญเข้าห้อง">
					<div className="flex justify-center">
						<QRCode value={getInviteUri(props.room.id!)} className="w-56" />
					</div>
				</Section>

				<Section title="ลิงก์เชิญเข้าห้อง">
					<div className="flex justify-between space-x-5">
						<input
							type="text"
							className="input flex-grow"
							defaultValue={getInviteUri(props.room.id!)}
							onFocus={(e) => e.target.select()}
							readOnly
						/>
						<Copy content={getInviteUri(props.room.id!)} />
					</div>
				</Section>

				<Section title="บิลรวม">
					<div className="text-main-grey">
						<div className="flex justify-between">
							<span>สินค้าทั้งหมด</span>
							<span>{props.room.itemCounts}</span>
						</div>
						<div className="flex justify-between">
							<span>ราคารวมทั้งหมด</span>
							<span>{props.room.total}</span>
						</div>
					</div>
				</Section>

				<Section title={`สมาชิกห้อง (${props.room.members?.length})`}>
					<div className="space-y-3">
						{props.room.members?.map((e, i) => (
							<div
								onClick={() =>
									router.push(`/room/${props.query.roomId}/member/${e.id}`)
								}
								key={i}
								className="flex items-center justify-between cursor-pointer"
							>
								<div className="flex items-center space-x-3">
									<img
										src={avatar(e.user?.email || e.id)}
										alt=""
										className="w-12"
									/>
									<div className="flex flex-col">
										<span>{e.nickname}</span>
										<span className="text-main-grey text-sm">
											{e.user?.email}
										</span>
									</div>
								</div>
								{renderRoleIcon(e.role!)}
							</div>
						))}
					</div>
				</Section>

				<Section title="สร้างเมื่อ">
					<div className="text-main-grey">28/09/2021 13:34:12</div>
				</Section>

				{props.isOwner && (
					<div onClick={onRemoveRoom} className="button bg-main-red text-white">
						ลบห้อง
					</div>
				)}
			</div>
		</div>
	)
}

export const getServerSideProps = auth(async ({ req, query }: any) => {
	const { roomId } = query

	const session = await getSession({ req })

	try {
		const res = await client.query({
			query: GET_ROOM_OVERVIEW,
			variables: {
				roomId,
			},
			context: { req },
		})
		const isOwner = res.data.room.owner.id === session?.user.id

		return {
			props: {
				room: res.data.room,
				isOwner,
				query,
			},
		}
	} catch (error) {
		return {
			notFound: true,
		}
	}
})

export default RoomOverview
