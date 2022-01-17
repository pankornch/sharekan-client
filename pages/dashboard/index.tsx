import DashboardNavbar from "@/src/components/DashboardNavbar"
import Link from "next/link"
import React, { FC, useCallback } from "react"
import auth from "@/src/middlewares/auth"
import dateFormatter from "@/src/utils/dateFormatter"
import { useRouter } from "next/dist/client/router"
import Loading from "@/src/components/Loading"
import ListView from "@/src/components/ListView"
import { useQuery } from "@apollo/client"
import { GET_ROOMS, JOIN_ROOM } from "@/src/gql"
import Select from "@/src/components/Select"
import client from "@/src/configs/apollo-client"

const Dashobard: FC = () => {
	const { data, refetch, loading } = useQuery(GET_ROOMS, {
		variables: { roomsType: "ALL", order: "DESC" },
	})
	const options = [
		{ label: "ทั้งหมด", value: "ALL" },
		{ label: "เจ้าของ", value: "OWNER" },
		{ label: "สมาชิก", value: "MEMBER" },
	]

	const router = useRouter()

	const onSelect = useCallback((option) => {
		refetch({
			roomsType: option.value,
		})
	}, [])

	return (
		<div className="ralative">
			<DashboardNavbar backButton backTo="/" />

			<div className="container pt-24 pb-24">
				<Select options={options} onSelect={onSelect} />

				{loading ? (
					<Loading />
				) : (
					<div className="mt-12 space-y-5 w-full h-full">
						<ListView
							data={data.me.rooms}
							render={(e) => (
								<div
									onClick={() => router.push(`/room/${e.id}`)}
									className={`item-card text-main-grey ${
										e.isOwner ? "border border-main-blue" : ""
									}`}
								>
									<div className="text-main-dark font-bold">{e.title}</div>

									<div className="flex justify-between">
										<span>สินค้าทั้งหมด</span>
										<span>{e.itemCounts} ชิ้น</span>
									</div>
									<div className="flex justify-between">
										<span>ราคารวมทั้งหมด</span>
										<span>{e.total}</span>
									</div>
									<div className="flex justify-between">
										<span>เจ้าของห้อง</span>
										<span>{e.owner?.name}</span>
									</div>
									<div className="flex justify-between">
										<span>สร้างเมื่อ</span>
										<span>{dateFormatter(e.createdAt!).dateTime}</span>
									</div>
								</div>
							)}
						/>
					</div>
				)}

				<div className="bottom-7 right-0 w-full fixed px-7 lg:px-56">
					<Link href="/room/create">
						<a className="button bg-main-blue text-white">สร้างห้อง</a>
					</Link>
				</div>
			</div>
		</div>
	)
}

export const getServerSideProps = auth(async ({ req, res }) => {
	const { join_room_id, member_id } = req.cookies

	if (join_room_id) {
		try {
			client.mutate({
				mutation: JOIN_ROOM,
				variables: {
					input: {
						id: join_room_id,
						memberId: member_id,
					},
				},
				context: { req },
			})
			res.setHeader("set-cookie", ["join_room_id=", "member_id="])

			return {
				redirect: {
					destination: `/room/${join_room_id}`,
				},
				props: {},
			}
		} catch (error: any) {
			res.setHeader("set-cookie", ["join_room_id=", "member_id="])
			if (error.graphQLErrors[0].message === "You are in this room") {

				return {
					redirect: {
						destination: `/room/${join_room_id}`,
					},
					props: {},
				}
			}
		}
	}
	res.setHeader("set-cookie", ["join_room_id=", "member_id="])
	return {
		props: {},
	}
})

export default Dashobard
