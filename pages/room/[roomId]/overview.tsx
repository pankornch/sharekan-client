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
import { IMember } from "@/src/types"
import { GET_ROOM_OVERVIEW, REMOVE_ROOM } from "@/src/gql"
import { useRouter } from "next/dist/client/router"
import { gql, useMutation, useQuery } from "@apollo/client"
import dateFormatter from "@/src/utils/dateFormatter"
import Loading from "@/src/components/Loading"
import Swal from "sweetalert2"

interface Props {
	query: {
		roomId: string
	}
	isOwner: boolean
}

const getInviteUri = (id: string) => {
	const { protocol, host } = location
	const url = `${protocol}//${host}`
	return `${url}/join_room?id=${id}`
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
	const { data: room, loading } = useQuery(GET_ROOM_OVERVIEW, {
		variables: { roomId: props.query.roomId },
	})

	const router = useRouter()

	const onRemoveRoom = async () => {
		const result = await Swal.fire({
			title: "ต้องการจะลบหรือไม่?",
			confirmButtonText: "ตกลง",
			showCancelButton: true,
			cancelButtonText: "ยกเลิก",
			confirmButtonColor: "#123AAF",
			icon: "warning",
		})

		if (!result.isConfirmed) return

		try {
			await removeRoom({
				variables: {
					input: {
						id: props.query.roomId,
					},
				},
			})
			router.replace("/dashboard")
		} catch (error) {}
	}

	if (loading) return <Loading />

	return (
		<div>
			<DashboardNavbar backButton backTo={`/room/${props.query.roomId}`} />

			<div className="container pt-24 pb-9 space-y-7">
				<Section title="ชื่อห้อง">
					<input
						type="text"
						className="input w-full"
						defaultValue={room.room.title}
						readOnly
					/>
				</Section>

				<Section title="ไอดีห้อง">
					<input
						type="text"
						className="input w-full"
						defaultValue={room.room.id}
						readOnly
					/>
				</Section>

				<Section title="QR Code เชิญเข้าห้อง">
					<div className="flex justify-center">
						<QRCode value={getInviteUri(room.room.id!)} className="w-56" />
					</div>
				</Section>

				<Section title="ลิงก์เชิญเข้าห้อง">
					<div className="flex justify-between space-x-5">
						<input
							type="text"
							className="input flex-grow"
							defaultValue={getInviteUri(room.room.id!)}
							onFocus={(e) => e.target.select()}
							readOnly
						/>
						<Copy content={getInviteUri(room.room.id!)} />
					</div>
				</Section>

				<Section title="บิลรวม">
					<div className="text-main-grey">
						<div className="flex justify-between">
							<span>สินค้าทั้งหมด</span>
							<span>{room.room.itemCounts}</span>
						</div>
						<div className="flex justify-between">
							<span>ราคารวมทั้งหมด</span>
							<span className="font-bold text-main-orange text-lg">
								{room.room.total}
							</span>
						</div>
					</div>
				</Section>

				<Section title={`สมาชิกห้อง (${room.room.members?.length})`}>
					<div className="space-y-3">
						{(room.room.members as IMember[]).map((e, i) => (
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
										<span className="font-bold text-main-orange">
											{e.cart?.total}
										</span>
									</div>
								</div>
								{renderRoleIcon(e.role!)}
							</div>
						))}
					</div>
				</Section>

				<Section title="สร้างเมื่อ">
					<div className="text-main-grey">
						{dateFormatter(room.room.createdAt!).dateTime}
					</div>
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

	try {
		const { data } = await client.query({
			query: gql`
				query ($roomId: ID!) {
					room(id: $roomId) {
						id
						isOwner
					}
				}
			`,
			variables: {
				roomId,
			},
			context: { req },
		})
		const { isOwner } = data.room
		return {
			props: {
				query,
				isOwner,
			},
		}
	} catch (error) {
		return {
			notFound: true,
		}
	}
})

export default RoomOverview
